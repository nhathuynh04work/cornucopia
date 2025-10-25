import { useEffect, useState } from "react";
import StudyWeeklyChart from "./StudyWeeklyChart";
import { api } from "@/apis/axios";

export default function StudyHeatmapContainer() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const {data} = await api.get("/users/study-statistics/yearly");
        console.log("📊 Weekly stats API response:", data);
        setStats(data.data);
      } catch (err) {
        console.error("Fetch study heatmap error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return <StudyWeeklyChart stats={stats} />;
}
