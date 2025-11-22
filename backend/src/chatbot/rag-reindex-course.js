// Giống rag-reindex.js của blog
import { CourseStatus } from "../generated/prisma/index.js";
import prisma from "../prisma.js";

// util đơn giản, giống blog
function stripHtml(html = "") {
  return String(html)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// cắt mảnh: name / price / description (lessons tính sau)
function buildCourseChunks(course) {
  const out = [];
  const name = (course.name || "").trim();
  const hasPrice = typeof course.price === "number";

  if (name) out.push(name);
  if (hasPrice) out.push(`Giá: ${course.price} VND`);

  // gộp tên + giá để tạo 1 chunk dài, giàu ngữ cảnh (ưu tiên cho summarizer)
  if (name && hasPrice) out.push(`${name} — Giá: ${course.price} VND`);

  if (course.description) {
    const desc = stripHtml(course.description);
    if (desc) out.push(desc);
  }
  return out.filter(Boolean);
}

async function main() {
  // xoá sạch rồi build lại
  await prisma.$executeRawUnsafe(`DELETE FROM course_chunks;`);

  const courses = await prisma.course.findMany({
    where: { status: CourseStatus.PUBLIC },
    select: { id: true, name: true, price: true, description: true },
  });

  let total = 0;
  for (const c of courses) {
    const pieces = buildCourseChunks(c);
    for (const content of pieces) {
      await prisma.courseChunk.create({
        data: { courseId: c.id, content },
      });
      total++;
    }
  }

  console.log(`✅ Reindexed ${courses.length} courses → ${total} chunks`);
  process.exit(0);
}

main().catch((e) => {
  console.error("❌ Course reindex failed:", e?.message || e);
  process.exit(1);
});
