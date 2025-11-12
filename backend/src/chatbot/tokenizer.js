const VN_STOP = new Set([
  "là",
  "gồm",
  "mấy",
  "một",
  "những",
  "các",
  "cái",
  "gì",
  "bao",
  "bao nhiêu",
  "nào",
  "như",
  "trong",
  "về",
  "của",
  "đến",
  "để",
  "và",
  "hoặc",
  "hay",
  "theo",
  "phần",
  "không",
  "có",
  "được",
  "làm",
  "tóm",
  "tắt",
  "xin",
  "hỏi",
]);

export const noAccent = (s = "") =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export const toLC = (s = "") => noAccent(String(s)).toLowerCase();

export function tokenize(q) {
  return Array.from(
    new Set(
      toLC(q)
        .split(/[^a-z0-9]+/i)
        .filter((t) => t && t.length >= 2 && !VN_STOP.has(t))
    )
  ).slice(0, 8);
}
