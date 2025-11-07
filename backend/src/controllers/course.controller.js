import * as courseService from "../services/course.service.js";

export async function getCourses(req, res) {
	const courses = await courseService.getAll();
	res.status(200).json({ courses });
}

export async function getCourseForInfoView(req, res) {
	const courseId = req.params.id;
	const userId = req?.user.id;

	const { course, accessStatus } = await courseService.getCourseForInfoView(
		courseId,
		userId
	);
	res.status(200).json({ course, accessStatus });
}

export async function getCourseForEditor(req, res) {
	const courseId = req.params.id;
	const userId = req.user.id;

	const course = await courseService.getCourseForEditor(courseId, userId);
	res.status(200).json({ course });
}

export async function getCourseForLearning(req, res) {
	const courseId = req.params.id;
	const userId = req.user.id;

	const course = await courseService.getCourseForLearning(courseId, userId);
	res.status(200).json({ course });
}

export async function getEnrolledCourses(req, res) {
	const userId = req.user.id;
	const courses = await courseService.getEnrolledCourses(userId);
	res.status(200).json({ courses });
}

export async function getMyCourses(req, res) {
	const userId = req.user.id;
	const courses = await courseService.getMyCourses(userId);
	res.status(200).json({ courses });
}

export async function createCourse(req, res) {
	const userId = req.user.id;

	const course = await courseService.create({ userId, ...req.body });
	res.status(201).json({ course });
}

export async function updateCourse(req, res) {
	const id = req.params.id;
	const course = await courseService.update(id, req.body);
	res.status(200).json({ course });
}

export async function deleteCourse(req, res) {
	const courseId = req.params.id;
	const userId = req.user.id;

	await courseService.remove(courseId, userId);
	res.status(204).end();
}

export async function addModule(req, res) {
	const id = req.params.id;
	const module = await courseService.addModule(id);
	res.status(201).json({ module });
}
