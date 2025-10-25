import PropTypes from "prop-types";
import { useState, useMemo } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { Tooltip as ReactTooltip } from "react-tooltip";

export default function StudyStatisticsHeatmap({ stats }) { 
  // Tạo danh sách 12 tháng gần nhất
  const last12Months = useMemo(() => {
    const today = new Date();
    const months = [];
    for (let i = 0; i < 12; i++) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      months.push({
        label: d.toLocaleString("default", { month: "long", year: "numeric" }),
        year: d.getFullYear(),
        month: d.getMonth(),
      });
    }
    return months.reverse(); // để tháng hiện tại ở cuối
  }, []);

  const [selectedMonthIndex, setSelectedMonthIndex] = useState(11); // mặc định tháng hiện tại

  // --- NẾU KHÔNG CÓ DATA --- 
  if (!stats || Object.keys(stats).length === 0) {
    return <p className="text-gray-500 text-center">Không có dữ liệu.</p>;
  }

  const selectedMonth = last12Months[selectedMonthIndex];

  // Lọc dữ liệu theo tháng được chọn
  const filteredValues = Object.entries(stats)
    .map(([date, count]) => ({ date, count }))
    .filter(({ date }) => {
      const d = new Date(date);
      return d.getFullYear() === selectedMonth.year && d.getMonth() === selectedMonth.month;
    });

  const startDate = new Date(selectedMonth.year, selectedMonth.month, 1);
  const endDate = new Date(selectedMonth.year, selectedMonth.month + 1, 0); // ngày cuối tháng

  // Thang màu dùng Tailwind (xanh lá giống GitHub)
  const getColorClass = (count) => {
    if (!count || count === 0) return "fill-gray-200";
    if (count < 2) return "fill-green-200";
    if (count < 4) return "fill-green-400";
    if (count < 6) return "fill-green-600";
    return "fill-green-800";
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md inline-block align-top w-[25%] ml-[15%] mb-6 h-[570px]">
      <h2 className="text-lg font-semibold mb-4 text-center">
        Biểu đồ hoạt động học tập theo ngày ({selectedMonth.label})
      </h2>

      <div className="mb-4 text-center">
        <select
          value={selectedMonthIndex}
          onChange={(e) => setSelectedMonthIndex(Number(e.target.value))}
          className="border rounded px-3 py-1"
        >
          {last12Months.map((m, idx) => (
            <option key={idx} value={idx}>
              {m.label}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <CalendarHeatmap
          startDate={startDate}
          endDate={endDate}
          values={filteredValues}
          classForValue={(value) => getColorClass(value?.count)}
          showWeekdayLabels={true}
          tooltipDataAttrs={(value) => ({
            "data-tooltip-id": "heatmap-tooltip",
            "data-tooltip-content": value?.date
              ? `${value.date}: ${value.count} lần học`
              : "Không có dữ liệu",
          })}
        />
      </div>

      <ReactTooltip id="heatmap-tooltip" place="top" />
    </div>
  );
}

StudyStatisticsHeatmap.propTypes = {
  stats: PropTypes.object.isRequired,
};
