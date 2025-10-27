import { api } from "./axios";

export async function getCourses() {
	const { data } = await api.get("/courses");
	return data.courses;
}

export async function createCourse(payload) {
	const { data } = await api.post("/courses", payload);
	return data.course;
}
