//Script reindex nội dung blog → post_chunks
import prisma from "../prisma.js";

function stripHtml(html) {
  return String(html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function split(text, max = 900) {
  const out = [];
  let i = 0;
  while (i < text.length) {
    let end = Math.min(i + max, text.length);
    const soft = text.lastIndexOf(".", end);
    if (soft > i + 200) end = soft + 1;
    out.push(text.slice(i, end).trim());
    i = end;
  }
  return out;
}

async function main() {
  await prisma.postChunk.deleteMany({});
  const posts = await prisma.post.findMany({ where: { status: "published" } });

  for (const p of posts) {
    const chunks = split(stripHtml(p.content));
    for (const c of chunks) {
      await prisma.postChunk.create({ data: { postId: p.id, content: c } });
    }
  }
  console.log("✅ Done indexing chunks.");
  process.exit(0);
}

main();
