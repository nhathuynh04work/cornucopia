import * as courseRepo from "../repositories/course.repository.js";
import { NotFoundError } from "../utils/AppError.js";

export async function getAll() {
	return courseRepo.getAll();
}

export async function getCourse(courseId) {
	const course = await courseRepo.findById(courseId);

	if (!course) throw new NotFoundError("Course not found");
	return course;
}

export async function create(data) {
	const createCoursePayload = {
		...data,
		modules: {
			create: {
				title: "First module",
			},
		},
	};
	return courseRepo.create(createCoursePayload);
}

export async function update(courseId, data) {
	const course = await courseRepo.findById(courseId);
	if (!course) throw new NotFoundError("Course not found");

	return courseRepo.update(courseId, data);
}
