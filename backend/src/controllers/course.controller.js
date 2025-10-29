import * as courseService from "../services/course.service.js";

export async function getCourses(req, res) {
	const courses = await courseService.getAll();
	res.status(200).json({ courses });
}

export async function getCourse(req, res) {
	const id = req.params.id;

	const course = await courseService.getCourse(id);
	res.status(200).json({ course });
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
