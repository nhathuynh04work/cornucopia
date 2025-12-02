import { CourseStatus, TestStatus } from "../generated/prisma/index.js";
import prisma from "../prisma.js";
import { stripHtml, splitText } from "./utils.js";

function buildCourseChunks(course) {
  const chunks = [];

  chunks.push(course.title);
  chunks.push(`Giá: ${course.price} VND`);
  chunks.push(course?.description || "");

  return chunks.filter(Boolean);
}

function buildPostChunks(post) {
  return splitText(stripHtml(post.content), 900);
}

function buildTestChunks(test) {
  const chunks = [];

  // Tiêu đề + mô tả
  if (test.title) chunks.push(test.title);
  if (test.description) chunks.push(stripHtml(test.description));

  // Lấy text câu hỏi + các lựa chọn
  for (const item of test.items || []) {
    let piece = "";

    if (item.text) {
      piece += stripHtml(item.text);
    }

    if (item.answerOptions?.length) {
      const opts = item.answerOptions
        .filter((o) => o.text)
        .map(
          (o, idx) => `${String.fromCharCode(65 + idx)}. ${stripHtml(o.text)}`
        )
        .join(" ");

      if (opts) {
        piece += piece ? " " + opts : opts;
      }
    }

    if (piece) {
      chunks.push(piece);
    }
  }

  // Cắt nhỏ 900 chars
  return chunks
    .map((c) => c.trim())
    .filter(Boolean)
    .flatMap((txt) => splitText(txt, 900));
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

export async function indexTest(testId) {
  if (!testId) return;

  const test = await prisma.test.findUnique({
    where: { id: testId },
    include: {
      items: {
        include: { answerOptions: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  // Xoá chunk cũ
  await prisma.testChunk.deleteMany({ where: { testId } });

  // Chỉ index test PUBLIC
  if (!test || test.status !== TestStatus.PUBLIC) return;

  const chunks = buildTestChunks(test);

  await Promise.all(
    chunks.map((content) =>
      prisma.testChunk.create({
        data: { testId, content },
      })
    )
  );
}
