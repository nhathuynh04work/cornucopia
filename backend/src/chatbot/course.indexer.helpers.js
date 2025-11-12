import prisma from "../prisma.js";
import { CourseStatus } from "../generated/prisma/index.js";

function stripHtml(html = "") {
  return String(html)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildCourseChunks(course) {
  const out = [];
  if (course.name) out.push(course.name.trim());
  if (typeof course.price === "number") out.push(`Giá: ${course.price} VND`);
  if (course.description) {
    const desc = stripHtml(course.description);
    if (desc) out.push(desc);
  }
  return out.filter(Boolean);
}

export async function reindexOneCourse(courseId) {
  const id = Number(courseId);
  if (!id) return;

  const c = await prisma.course.findUnique({
    where: { id },
    select: {
      id: true,
      status: true,
      name: true,
      price: true,
      description: true,
    },
  });
  if (!c || c.status !== CourseStatus.PUBLIC) {
    // không public thì xóa chunk (nếu có) cho đúng logic
    await prisma.courseChunk.deleteMany({ where: { courseId: id } });
    return;
  }

  await prisma.courseChunk.deleteMany({ where: { courseId: id } });

  const pieces = buildCourseChunks(c);
  for (const content of pieces) {
    await prisma.courseChunk.create({ data: { courseId: id, content } });
  }
}
