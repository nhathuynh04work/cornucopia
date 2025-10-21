// Chuẩn hoá topics về dạng [{id,name,slug}]
export function normalizeTopics(input) {
  if (!input) return [];
  if (Array.isArray(input) && input.length && input[0]?.topic) {
    return input.map((pt) => pt.topic);
  }
  if (Array.isArray(input)) return input;
  if (input.topic) {
    return [
      typeof input.topic === "string"
        ? {
            id: input.topic_id ?? null,
            name: input.topic,
            slug: input.topic_slug ?? null,
          }
        : input.topic,
    ];
  }
  return [];
}

export function mapPost(raw) {
  const topics = normalizeTopics(raw.topics ? raw : { topic: raw.topic });
  const coverUrl = raw.coverUrl ?? raw.cover_url ?? null;
  return {
    ...raw,
    topics,
    coverUrl,
  };
}
