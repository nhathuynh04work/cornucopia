import * as courseRepo from "../repositories/course.repository.js";

export async function getAll() {
	return courseRepo.getAll();
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
