import prisma from "../prisma.js";
import {
	ForbiddenError,
	NotFoundError,
	BadRequestError,
} from "../utils/AppError.js";
import { indexCourse } from "../chatbot/indexer.js";
import { CourseStatus } from "../generated/prisma/index.js";
import { promoteFile, deleteFile } from "../utils/fileManager.js";

const processHtmlContent = async (html) => {
	if (!html) return html;

	const tempImgRegex = /src="([^"]*?\/tmp\/[^"]*?)"/g;
	const matches = [...html.matchAll(tempImgRegex)];

	let processedHtml = html;

	for (const match of matches) {
		const tempUrl = match[1];

		const permUrl = await promoteFile(tempUrl, "courses/content");

		processedHtml = processedHtml.replace(tempUrl, permUrl);
	}

	return processedHtml;
};

const updateCourseRatingStats = async (courseId) => {
	const aggregate = await prisma.review.aggregate({
		where: { courseId },
		_avg: { rating: true },
		_count: { rating: true },
	});

	const averageRating = aggregate._avg.rating || 0;
	const ratingCount = aggregate._count.rating || 0;

	await prisma.course.update({
		where: { id: courseId },
		data: {
			averageRating,
			ratingCount,
		},
	});
};

const getReviewStats = async (courseId) => {
	const [aggregates, distribution] = await Promise.all([
		prisma.review.aggregate({
			where: { courseId },
			_avg: { rating: true },
			_count: { rating: true },
		}),
		prisma.review.groupBy({
			by: ["rating"],
			where: { courseId },
			_count: { rating: true },
		}),
	]);

	const total = aggregates._count.rating || 0;
	const avg = aggregates._avg.rating || 0;

	const distMap = {};
	distribution.forEach((d) => {
		distMap[d.rating] = d._count.rating;
	});

	const ratingDist = [5, 4, 3, 2, 1].map((stars) => {
		const count = distMap[stars] || 0;
		return {
			stars,
			count,
			percent: total > 0 ? Math.round((count / total) * 100) : 0,
		};
	});

	return {
		rating: Number(avg.toFixed(1)),
		ratingCount: total,
		ratingDist,
	};
};

const getAll = async ({
	search,
	sort,
	status,
	userId,
	enrolledUserId,
	page = 1,
	limit = 10,
	level,
	language,
	minRating,
	priceType,
}) => {
	const where = {};

	if (status) where.status = status;

	if (!status && !userId && !enrolledUserId) {
		where.status = "PUBLIC";
	}

	if (userId) where.userId = userId;
	if (enrolledUserId) {
		where.enrollments = { some: { userId: enrolledUserId } };
	}

	if (search) {
		where.title = { contains: search, mode: "insensitive" };
	}

	if (level && level.length > 0 && !level.includes("ALL_LEVELS")) {
		where.level = { in: level };
	}

	if (language && language.length > 0) {
		where.language = { in: language };
	}

	if (minRating) {
		where.averageRating = { gte: minRating };
	}

	if (priceType === "free") {
		where.price = 0;
	} else if (priceType === "paid") {
		where.price = { gt: 0 };
	}

	let orderBy = { createdAt: "desc" };

	if (sort === "oldest") {
		orderBy = { createdAt: "asc" };
	} else if (sort === "price_asc") {
		orderBy = { price: "asc" };
	} else if (sort === "price_desc") {
		orderBy = { price: "desc" };
	} else if (sort === "rating") {
		orderBy = { averageRating: "desc" };
	} else if (sort === "popular") {
		orderBy = { enrollments: { _count: "desc" } };
	}

	const skip = (page - 1) * limit;

	const [courses, totalItems] = await Promise.all([
		prisma.course.findMany({
			where,
			orderBy,
			skip,
			take: limit,
			include: {
				user: { select: { id: true, name: true, avatarUrl: true } },
				_count: { select: { enrollments: true } },
				modules: {
					select: {
						lessons: {
							where: { isPublished: true },
							select: { duration: true },
						},
					},
				},
			},
		}),
		prisma.course.count({ where }),
	]);

	const mappedCourses = courses.map((course) => {
		let duration = 0;
		let lessons = 0;

		course.modules.forEach((mod) => {
			lessons += mod.lessons.length;
			duration += mod.lessons.reduce((acc, l) => acc + l.duration, 0);
		});

		return {
			id: course.id,
			title: course.title,
			excerpt: course.excerpt,
			coverUrl: course.coverUrl,
			price: course.price,
			user: course.user,
			_count: course._count,
			status: course.status,
			level: course.level,
			language: course.language,

			stats: {
				rating: Number(course.averageRating.toFixed(1)),
				ratingCount: course.ratingCount,
			},

			duration,
			lessons,
		};
	});

	return {
		data: mappedCourses,
		pagination: {
			totalItems,
			totalPages: Math.ceil(totalItems / limit),
			currentPage: page,
		},
	};
};

const getCourseForInfoView = async (courseId, userId) => {
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
			reviews: {
				where: { userId },
				take: 1,
			},

			_count: { select: { enrollments: true } },
		},
	});

	if (!course) throw new NotFoundError("Course not found");

	const stats = await getReviewStats(courseId);
	const userReview = course?.reviews?.[0] || null;

	return { ...course, stats, userReview };
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

	const course = await prisma.course.findUnique({
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

			reviews: {
				where: { userId },
				take: 1,
			},
		},
	});

	if (course && course.modules) {
		course.modules = course.modules
			.map((module) => ({
				...module,
				lessons: module.lessons.map((lesson) => {
					const { progress, ...rest } = lesson;
					return {
						...rest,
						isCompleted:
							progress.length > 0
								? progress[0].isCompleted
								: false,
					};
				}),
			}))
			.filter((module) => module.lessons.length > 0);
	}

	const stats = await getReviewStats(courseId);
	const userReview = course?.reviews?.[0] || null;

	return {
		...course,
		stats,
		userReview,
		reviews: undefined,
	};
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

	if (data.coverUrl && data.coverUrl.includes("/tmp/")) {
		data.coverUrl = await promoteFile(data.coverUrl, "courses/covers");

		if (course.coverUrl && course.coverUrl !== data.coverUrl) {
			deleteFile(course.coverUrl);
		}
	} else if (data.coverUrl === null && course.coverUrl) {
		deleteFile(course.coverUrl);
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
		include: {
			_count: { select: { enrollments: true } },

			modules: {
				include: {
					lessons: { select: { videoUrl: true } },
				},
			},
		},
	});

	if (!course)
		throw new ForbiddenError(
			"You do not have permission to delete this course."
		);

	if (course._count.enrollments > 0)
		throw new ForbiddenError(
			"Cannot delete a course with enrolled students. Please archive it instead."
		);

	if (course.coverUrl) {
		deleteFile(course.coverUrl);
	}

	if (course.modules) {
		for (const module of course.modules) {
			if (module.lessons) {
				for (const lesson of module.lessons) {
					if (lesson.videoUrl) {
						deleteFile(lesson.videoUrl);
					}
				}
			}
		}
	}

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
		include: {
			_count: { select: { lessons: true } },
		},
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

	if (payload.videoUrl) {
		payload.videoUrl = await promoteFile(
			payload.videoUrl,
			"courses/videos"
		);
	}
	if (payload.htmlContent) {
		payload.htmlContent = await processHtmlContent(payload.htmlContent);
	}

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

	if (data.videoUrl && data.videoUrl.includes("/tmp/")) {
		data.videoUrl = await promoteFile(data.videoUrl, "courses/videos");

		if (lesson.videoUrl && lesson.videoUrl !== data.videoUrl) {
			deleteFile(lesson.videoUrl);
		}
	} else if (data.videoUrl === null && lesson.videoUrl) {
		deleteFile(lesson.videoUrl);
	}

	if (data.htmlContent) {
		data.htmlContent = await processHtmlContent(data.htmlContent);
	}

	return prisma.lesson.update({
		where: { id: lessonId },
		data,
	});
};

const removeLesson = async (lessonId) => {
	const lesson = await prisma.lesson.findUnique({
		where: { id: lessonId },
		select: { videoUrl: true },
	});

	if (lesson && lesson.videoUrl) {
		deleteFile(lesson.videoUrl);
	}

	return prisma.lesson.delete({ where: { id: lessonId } });
};

const updateLessonProgress = async (
	courseId,
	lessonId,
	userId,
	isCompleted
) => {
	const lesson = await prisma.lesson.findUnique({
		where: { id: lessonId },
		include: { module: true },
	});

	if (!lesson) throw new NotFoundError("Lesson not found");

	if (lesson.module.courseId !== courseId) {
		throw new NotFoundError("Lesson not found in this course");
	}

	const enrollment = await prisma.userCourseEnrollment.findUnique({
		where: {
			userId_courseId: { userId, courseId },
		},
	});

	const course = await prisma.course.findUnique({
		where: { id: courseId },
		select: { userId: true },
	});

	if (!enrollment && course.userId !== userId) {
		throw new ForbiddenError("You are not enrolled in this course");
	}

	return prisma.userLessonProgress.upsert({
		where: {
			userId_lessonId: { userId, lessonId },
		},
		update: { isCompleted },
		create: {
			userId,
			lessonId,
			isCompleted,
		},
	});
};

const getReviews = async (
	courseId,
	{ page = 1, limit = 10, sort = "newest", rating }
) => {
	const where = { courseId };
	if (rating) where.rating = rating;

	let orderBy = { createdAt: "desc" };
	if (sort === "oldest") orderBy = { createdAt: "asc" };

	const [reviews, total] = await Promise.all([
		prisma.review.findMany({
			where,
			orderBy,
			skip: (page - 1) * limit,
			take: limit,
			include: {
				user: {
					select: {
						id: true,
						name: true,
						avatarUrl: true,
					},
				},
			},
		}),
		prisma.review.count({ where }),
	]);

	return {
		reviews,
		pagination: {
			page,
			limit,
			total,
			totalPages: Math.ceil(total / limit),
		},
	};
};

const addReview = async (courseId, userId, { rating, content }) => {
	const enrollment = await prisma.userCourseEnrollment.findUnique({
		where: { userId_courseId: { userId, courseId } },
	});

	const course = await prisma.course.findUnique({ where: { id: courseId } });
	if (!course) throw new NotFoundError("Course not found");

	if (!enrollment && course.userId !== userId) {
		throw new ForbiddenError("You must be enrolled to review this course.");
	}

	const existing = await prisma.review.findUnique({
		where: { userId_courseId: { userId, courseId } },
	});

	if (existing) {
		throw new BadRequestError("You have already reviewed this course.");
	}

	const review = await prisma.review.create({
		data: {
			userId,
			courseId,
			rating,
			content,
		},
		include: {
			user: { select: { id: true, name: true, avatarUrl: true } },
		},
	});

	await updateCourseRatingStats(courseId);

	return review;
};

const updateReview = async (reviewId, userId, data) => {
	const review = await prisma.review.findUnique({ where: { id: reviewId } });

	if (!review) throw new NotFoundError("Review not found");
	if (review.userId !== userId)
		throw new ForbiddenError("You can only edit your own review");

	const updatedReview = await prisma.review.update({
		where: { id: reviewId },
		data,
		include: {
			user: { select: { id: true, name: true, avatarUrl: true } },
		},
	});

	await updateCourseRatingStats(review.courseId);

	return updatedReview;
};

const deleteReview = async (reviewId, userId) => {
	const review = await prisma.review.findUnique({ where: { id: reviewId } });

	if (!review) throw new NotFoundError("Review not found");
	if (review.userId !== userId)
		throw new ForbiddenError("You can only delete your own review");

	await prisma.review.delete({ where: { id: reviewId } });

	await updateCourseRatingStats(review.courseId);

	return { message: "Review deleted" };
};

export const courseService = {
	getAll,
	getCourseForInfoView,
	getCourseForEditor,
	getCourseForLearning,
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

	updateLessonProgress,

	getReviews,
	addReview,
	updateReview,
	deleteReview,
};
