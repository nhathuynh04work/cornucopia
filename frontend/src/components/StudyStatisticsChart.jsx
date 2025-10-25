import PropTypes from "prop-types";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function StudyStatisticsChart({ stats }) {
  if (!stats || Object.keys(stats).length === 0) {
    return <p className="text-gray-500 text-center">Không có dữ liệu.</p>;
  }

  // Sort months chronologically (YYYY-MM)
  const months = Object.keys(stats).sort();
  const totals = months.map((m) => stats[m].total);

  const chartData = {
    labels: months,
    datasets: [
      {
        label: "Study Sessions per Month",
        data: totals,
        backgroundColor: "rgba(99, 132, 255, 0.6)",
        borderColor: "rgba(99, 132, 255, 1)",
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (context) => ` ${context.raw} sessions`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Sessions",
        },
      },
      x: {
        title: {
          display: true,
          text: "Month",
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md inline-block align-top w-[50%] ml-[3%]">
      <h2 className="text-lg font-semibold mb-4 text-center">
        Thống kê học tập hàng tháng (12 Tháng Gần Nhất)
      </h2>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
}

StudyStatisticsChart.propTypes = {
  stats: PropTypes.object.isRequired,
};
