// ⚙️ Bộ nhớ tạm của mỗi IP (không lưu DB)
const BUCKET = new Map();
const CAP = 12; // tối đa yêu cầu mỗi phút

export function ipLimiter(req, res, next) {
  // Lấy IP client robust (dùng được cho cả nginx / proxy)
  const ip =
    req.ip ||
    req.headers["x-forwarded-for"] ||
    req.socket?.remoteAddress ||
    "unknown";

  let bucket = BUCKET.get(ip);

  // Nếu IP lần đầu xuất hiện → cấp full token
  if (!bucket) {
    bucket = { tokens: CAP, last: Date.now() };
    BUCKET.set(ip, bucket);
  }

  // Phục hồi token dựa trên thời gian đã trôi qua
  const mins = (Date.now() - bucket.last) / 60000;
  const refill = Math.floor(mins * CAP);
  if (refill > 0) {
    bucket.tokens = Math.min(CAP, bucket.tokens + refill);
    bucket.last = Date.now();
  }

  // Nếu hết token → từ chối
  if (bucket.tokens <= 0) {
    return res
      .status(429)
      .json({ error: "Too many requests. Try again later." });
  }

  bucket.tokens--;
  next();
}
