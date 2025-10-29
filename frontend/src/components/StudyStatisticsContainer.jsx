import { useEffect, useState } from "react";
import StudyStatisticsChart from "./StudyStatisticsChart";
import { api } from "@/apis/axios";

export default function StudyStatisticsContainer() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      const { data } = await api.get("/users/study-statistics");
      setStats(data.stats);
    }

    fetchStats();
  }, []);

  if (!stats) return <p>Đang tải...</p>;

  return <StudyStatisticsChart stats={stats} />;
}
