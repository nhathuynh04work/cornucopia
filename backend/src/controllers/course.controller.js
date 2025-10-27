import * as courseService from "../services/course.service.js";

export async function createCourse(req, res) {
	const userId = req.user.id;

	const course = await courseService.create({ userId, ...req.body });
	res.status(201).json({ course });
}
