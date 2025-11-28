import prisma from "../prisma.js";
import { ForbiddenError, NotFoundError } from "../utils/AppError.js";
import { calculateCourseProgress } from "../utils/calculate.js";
import { indexCourse } from "../chatbot/indexer.js";
import { CourseStatus } from "../generated/prisma/index.js";

const getAll = async ({ search, sort, status, userId, enrolledUserId }) => {
	const where = {};

	if (status) where.status = status;
	if (userId) where.userId = userId;
	if (enrolledUserId) {
		where.enrollments = { some: { userId: enrolledUserId } };
	}

	if (search) {
		where.title = { contains: search, mode: "insensitive" };
	}

	let orderBy = { createdAt: "desc" };
	if (sort === "oldest") orderBy = { createdAt: "asc" };
	else if (sort === "price_asc") orderBy = { price: "asc" };
	else if (sort === "price_desc") orderBy = { price: "desc" };

	return prisma.course.findMany({
		where,
		orderBy,
		include: {
			user: { select: { id: true, name: true, avatarUrl: true } },
			_count: { select: { enrollments: true } },
		},
	});
};

const getCourseForInfoView = async (courseId) => {
	const course = await prisma.course.findUnique({
		where: { id: courseId },
		include: {
			user: { select: { id: true, name: true, avatarUrl: true } },

			modules: {
				where: {
					lessons: { some: { isPublished: true } },
				},
				orderBy: { sortOrder: "asc" },
				select: {
					id: true,
					title: true,

					lessons: {
						where: { isPublished: true },
						orderBy: { sortOrder: "asc" },
						select: {
							id: true,
							title: true,
							duration: true,
							type: true,
						},
					},
				},
			},
			_count: { select: { enrollments: true } },
		},
	});

	if (!course) throw new NotFoundError("Course not found");
	return course;
};

const getCourseForEditor = async (courseId, userId) => {
	const course = await prisma.course.findFirst({
		where: { id: courseId, userId: userId },
	});

	if (!course)
		throw new ForbiddenError(
			"You do not have permission to edit this course."
		);

	return prisma.course.findUnique({
		where: { id: courseId },
		include: {
			modules: {
				orderBy: { sortOrder: "asc" },
				include: {
					lessons: {
						orderBy: { sortOrder: "asc" },
					},
				},
			},
			_count: { select: { enrollments: true } },
		},
	});
};

const getCourseForLearning = async (courseId, userId) => {
	const accessCheck = await prisma.course.findFirst({
		where: {
			id: courseId,
			OR: [
				{ userId: userId },
				{ enrollments: { some: { userId: userId } } },
			],
		},
		select: { id: true, userId: true },
	});

	if (!accessCheck)
		throw new ForbiddenError(
			"You are not enrolled in this course or do not own it."
		);

	const isOwner = accessCheck.userId === userId;

	const moduleWhere = isOwner
		? {}
		: { lessons: { some: { isPublished: true } } };
	const lessonWhere = isOwner ? {} : { isPublished: true };

	return prisma.course.findUnique({
		where: { id: courseId },
		include: {
			modules: {
				where: moduleWhere,
				orderBy: { sortOrder: "asc" },
				include: {
					lessons: {
						where: lessonWhere,
						orderBy: { sortOrder: "asc" },
						include: {
							progress: { where: { userId: userId } },
						},
					},
				},
			},
		},
	});
};

const getEnrolledCourses = async (userId) => {
	const courses = await prisma.course.findMany({
		where: { enrollments: { some: { userId: userId } } },
		include: {
			user: { select: { id: true, name: true, avatarUrl: true } },
			modules: {
				where: { lessons: { some: { isPublished: true } } },
				select: {
					lessons: {
						where: { isPublished: true },
						select: {
							id: true,
							progress: {
								where: { userId },
								select: { isCompleted: true },
							},
						},
					},
				},
			},
			_count: { select: { enrollments: true } },
		},
	});

	return courses.map((course) => ({
		...course,
		progress: calculateCourseProgress(course),
	}));
};

const getMyCourses = async (userId) => {
	return prisma.course.findMany({
		where: { userId },
		include: {
			_count: { select: { enrollments: true } },
		},
		orderBy: { createdAt: "desc" },
	});
};

const getUserCourseEnrollment = async (courseId, userId) => {
	return prisma.userCourseEnrollment.findUnique({
		where: {
			userId_courseId: { userId, courseId },
		},
	});
};

const createCourse = async ({ userId }) => {
	const payload = {
		title: "Học ngoại ngữ cùng Cornucopia",
		excerpt: "Cornucopia là nền tảng học ngoại ngữ uy tín nhất thế giới.",
		userId: userId,
		price: 0,
		modules: {
			create: {
				title: "Giới thiệu",
				sortOrder: 0,
			},
		},
	};

	const course = await prisma.course.create({ data: payload });
	indexCourse(course.id);
	return course;
};

const updateCourse = async (courseId, data) => {
	const course = await prisma.course.findUnique({
		where: { id: courseId },
		include: { _count: { select: { enrollments: true } } },
	});

	if (!course) throw new NotFoundError("Course not found");

	const hasEnrollments = course._count.enrollments > 0;

	if (data.status && data.status !== course.status) {
		if (data.status === CourseStatus.DRAFT && hasEnrollments) {
			throw new ForbiddenError(
				"Cannot revert to DRAFT because students are enrolled. Please use ARCHIVED instead."
			);
		}

		if (
			course.status === CourseStatus.DRAFT &&
			data.status === CourseStatus.PUBLIC
		) {
			await prisma.lesson.updateMany({
				where: { module: { courseId: courseId } },
				data: { isPublished: true },
			});
		}
	}

	const updated = await prisma.course.update({
		where: { id: courseId },
		data,
	});

	indexCourse(updated.id);
	return updated;
};

const removeCourse = async (courseId, userId) => {
	const course = await prisma.course.findFirst({
		where: { id: courseId, userId: userId },
		include: { _count: { select: { enrollments: true } } },
	});

	if (!course)
		throw new ForbiddenError(
			"You do not have permission to delete this course."
		);

	if (course._count.enrollments > 0)
		throw new ForbiddenError(
			"Cannot delete a course with enrolled students. Please archive it instead."
		);

	await prisma.course.delete({ where: { id: courseId } });
	indexCourse(courseId);
	return { message: "Course deleted successfully." };
};

const addModule = async (courseId, payload) => {
	const course = await prisma.course.findUnique({
		where: { id: courseId },
		include: { modules: { select: { sortOrder: true } } },
	});

	if (!course) throw new NotFoundError("Course not found");

	const currentMax = course.modules.reduce(
		(max, m) => (m.sortOrder > max ? m.sortOrder : max),
		-1
	);

	return prisma.module.create({
		data: {
			courseId,
			...payload,
			sortOrder: currentMax + 1,
		},
	});
};

const updateModule = async (moduleId, data) => {
	const module = await prisma.module.findUnique({ where: { id: moduleId } });
	if (!module) throw new NotFoundError("Module not found");

	return prisma.module.update({
		where: { id: moduleId },
		data,
	});
};

const removeModule = async (moduleId) => {
	const module = await prisma.module.findUnique({
		where: { id: moduleId },
		include: { _count: { select: { lessons: true } } },
	});

	if (!module) throw new NotFoundError("Module not found");

	if (module._count.lessons > 0) {
		throw new ForbiddenError(
			"Cannot delete a module that contains lessons. Please delete the lessons first."
		);
	}

	return prisma.module.delete({ where: { id: moduleId } });
};

const addLesson = async (moduleId, payload) => {
	const module = await prisma.module.findUnique({
		where: { id: moduleId },
		include: { lessons: { select: { sortOrder: true } } },
	});

	if (!module) throw new NotFoundError("Module not found");

	const currentMax = module.lessons.reduce(
		(max, l) => (l.sortOrder > max ? l.sortOrder : max),
		-1
	);

	return prisma.lesson.create({
		data: {
			moduleId,
			...payload,
			sortOrder: currentMax + 1,
			isPublished: false,
		},
	});
};

const updateLesson = async (lessonId, data) => {
	const lesson = await prisma.lesson.findUnique({
		where: { id: lessonId },
		include: {
			module: {
				include: {
					course: { select: { status: true } },
				},
			},
		},
	});

	if (!lesson) throw new NotFoundError("Lesson not found");

	if (
		data.isPublished !== undefined &&
		data.isPublished !== lesson.isPublished
	) {
		if (lesson.module.course.status === CourseStatus.DRAFT) {
			throw new ForbiddenError(
				"Cannot change lesson status while the course is in Draft. Please publish the course first."
			);
		}
	}

	return prisma.lesson.update({
		where: { id: lessonId },
		data,
	});
};

const removeLesson = async (lessonId) => {
	return prisma.lesson.delete({ where: { id: lessonId } });
};

export const courseService = {
	getAll,
	getCourseForInfoView,
	getCourseForEditor,
	getCourseForLearning,
	getEnrolledCourses,
	getMyCourses,
	getUserCourseEnrollment,
	createCourse,
	updateCourse,
	removeCourse,

	addModule,
	updateModule,
	removeModule,

	addLesson,
	updateLesson,
	removeLesson,
};
