import { CourseStatus } from "../generated/prisma/index.js";
import prisma from "../prisma.js";
import * as ragRepo from "./rag.repository.js";
import { stripHtml, splitText } from "./utils.js";

function buildCourseChunks(course) {
	const chunks = [];

	chunks.push(course.name);
	chunks.push(`Giá: ${course.price} VND`);
	chunks.push(course?.description || "");

	return chunks.filter(Boolean);
}

function buildPostChunks(post) {
	return splitText(stripHtml(post.content), 900);
}

export async function indexCourse(courseId) {
	if (!courseId) return;

	const course = await prisma.course.findUnique({
		where: { id: courseId },
	});

	await prisma.courseChunk.deleteMany({ where: { courseId } });

	if (!course || course.status !== CourseStatus.PUBLIC) return;

	const chunks = buildCourseChunks(course);
	await Promise.all(
		chunks.map((chunk) =>
			prisma.courseChunk.create({ data: { courseId, content: chunk } })
		)
	);
}

export async function indexPost(postId) {
	if (!postId) return;

	const post = await prisma.post.findUnique({
		where: { id: postId },
	});

	await prisma.postChunk.deleteMany({ where: { postId } });

	if (!post) return;

	const chunks = buildPostChunks(post);
	await Promise.all(
		chunks.map((chunk) =>
			prisma.postChunk.create({ data: { postId, content: chunk } })
		)
	);
}
