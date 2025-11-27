import { courseService } from "./course.service.js";

const getCourses = async (req, res) => {
	const { search, sort, status, userId, enrolledUserId } = req.query;

	const courses = await courseService.getAll({
		search,
		sort,
		status,
		userId: userId ? Number(userId) : undefined,
		enrolledUserId: enrolledUserId ? Number(enrolledUserId) : undefined,
	});

	res.status(200).json({ courses });
};

const getCourseForInfoView = async (req, res) => {
	const courseId = req.params.id;
	const course = await courseService.getCourseForInfoView(courseId);
	res.status(200).json({ course });
};

const getCourseForEditor = async (req, res) => {
	const courseId = req.params.id;
	const userId = req.user.id;
	const course = await courseService.getCourseForEditor(courseId, userId);
	res.status(200).json({ course });
};

const getCourseForLearning = async (req, res) => {
	const courseId = req.params.id;
	const userId = req.user.id;
	const course = await courseService.getCourseForLearning(courseId, userId);
	res.status(200).json({ course });
};

const getEnrolledCourses = async (req, res) => {
	const userId = req.user.id;
	const courses = await courseService.getEnrolledCourses(userId);
	res.status(200).json({ courses });
};

const getMyCourses = async (req, res) => {
	const userId = req.user.id;
	const courses = await courseService.getMyCourses(userId);
	res.status(200).json({ courses });
};

const getUserCourseEnrollment = async (req, res) => {
	const courseId = req.params.id;
	const userId = req.user.id;
	const enrollment = await courseService.getUserCourseEnrollment(
		courseId,
		userId
	);
	res.status(200).json({ enrollment });
};

const createCourse = async (req, res) => {
	const userId = req.user.id;
	const course = await courseService.createCourse({ userId });
	res.status(201).json({ course });
};

const updateCourse = async (req, res) => {
	const id = req.params.id;
	const course = await courseService.updateCourse(id, req.body);
	res.status(200).json({ course });
};

const deleteCourse = async (req, res) => {
	const courseId = req.params.id;
	const userId = req.user.id;
	await courseService.removeCourse(courseId, userId);
	res.status(204).end();
};

// --- MODULES ---
const addModule = async (req, res) => {
	const { courseId } = req.params;
	const module = await courseService.addModule(courseId, req.body);
	res.status(201).json({ module });
};

const updateModule = async (req, res) => {
	const { moduleId } = req.params;
	const module = await courseService.updateModule(moduleId, req.body);
	res.status(200).json({ module });
};

const deleteModule = async (req, res) => {
	const { moduleId } = req.params;
	await courseService.removeModule(moduleId);
	res.status(204).end();
};

// --- LESSONS ---
const addLesson = async (req, res) => {
	const { moduleId } = req.params;
	const lesson = await courseService.addLesson(moduleId, req.body);
	res.status(201).json({ lesson });
};

const updateLesson = async (req, res) => {
	const { lessonId } = req.params;
	const lesson = await courseService.updateLesson(lessonId, req.body);
	res.status(200).json({ lesson });
};

const deleteLesson = async (req, res) => {
	const { lessonId } = req.params;
	await courseService.removeLesson(lessonId);
	res.status(204).end();
};

export const courseController = {
	getCourses,
	getCourseForInfoView,
	getCourseForEditor,
	getCourseForLearning,
	getEnrolledCourses,
	getMyCourses,
	getUserCourseEnrollment,
	createCourse,
	updateCourse,
	deleteCourse,
	addModule,
	updateModule,
	deleteModule,
	addLesson,
	updateLesson,
	deleteLesson,
};
