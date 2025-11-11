export function stripHtml(html = "") {
  return String(html)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function splitText(text, max = 900) {
  const out = [];
  let i = 0;
  while (i < text.length) {
    let end = Math.min(i + max, text.length);
    const soft = text.lastIndexOf(".", end);
    if (soft > i + 200) end = soft + 1;
    out.push(text.slice(i, end).trim());
    i = end;
  }
  return out.filter(Boolean);
}

export function cleanFragment(s = "") {
  const text = String(s || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
  const firstSentence = text.split(/[.!?](\s|$)/)[0].trim();
  return firstSentence || text;
}
