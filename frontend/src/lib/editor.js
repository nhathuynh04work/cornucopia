export const MIN_TITLE_LEN = 5;
export const AUTOSAVE_MS = 5000;

export const toPlainText = (html = "") =>
  String(html)
    .replace(/<[^>]+>/g, "")
    .trim();

export const toFiniteIds = (arr = []) =>
  arr.map((x) => Number(x)).filter(Number.isFinite);

export const extractTopicIds = (post) =>
  Array.isArray(post?.topics) ? toFiniteIds(post.topics.map((t) => t?.id)) : [];
