import { useEffect, useState } from "react";
import { api } from "../apis/axios";

/**
 * Nếu có slug -> fetch 1 topic (/topics/:slug)
 * Nếu không có slug -> fetch danh sách topics (/topics)
 */
export function useTopicData(slug = null) {
  const [topic, setTopic] = useState(null);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        if (slug) {
          const { data } = await api.get(`/topics/${encodeURIComponent(slug)}`);
          if (mounted) setTopic(data?.topic || data);
        } else {
          const { data } = await api.get("/topics");
          const list = Array.isArray(data) ? data : data.topics || [];
          if (mounted) setTopics(list);
        }
      } catch (e) {
        if (mounted) setError(e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [slug]);

  return { topic, topics, loading, error };
}

/** Aliases (tuỳ thích dùng cho code đọc dễ hơn) */
export const useTopics = () => useTopicData();
export const useTopic = (slug) => useTopicData(slug);
