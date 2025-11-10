import { api } from "./axios";

export async function getCourses() {
	const { data } = await api.get("/courses");
	return data.courses;
}

export async function getCourseForInfoView(courseId) {
	const { data } = await api.get(`/courses/${courseId}/info`);
	return data.course;
}

export async function getEnrollmentStatus(courseId) {
	const { data } = await api.get(`/courses/${courseId}/enrollment`);
	return data.enrollment;
}

export async function getCourseForEditor(courseId) {
	const { data } = await api.get(`/courses/${courseId}/edit`);
	return data.course;
}

export async function getCourseForLearning(courseId) {
	const { data } = await api.get(`/courses/${courseId}/learn`);
	return data.course;
}

export async function getEnrolledCourses() {
	const { data } = await api.get("/courses/enrolled");
	return data.courses;
}

export async function getMyCourses() {
	const { data } = await api.get("/courses/my-courses");
	return data.courses;
}

export async function create(payload) {
	const { data } = await api.post("/courses", payload);
	return data.course;
}

export async function update(courseId, payload) {
	const { data } = await api.patch(`/courses/${courseId}`, payload);
	return data.course;
}

export async function remove(courseId) {
	await api.delete(`/courses/${courseId}`);
}

export async function addModule(courseId) {
	const { data } = await api.post(`/courses/${courseId}/modules`);
	return data.module;
}

export async function createCheckoutSession(courseId) {
	const { data } = await api.post(`/checkout/create-session/${courseId}`);
	return data.url;
}
