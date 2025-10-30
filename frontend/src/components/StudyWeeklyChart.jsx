import PropTypes from "prop-types";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { Tooltip as ReactTooltip } from "react-tooltip";

export default function StudyStatisticsHeatmap({ stats }) {
  // Tính ngày bắt đầu và kết thúc (12 tháng gần nhất)
  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(endDate.getFullYear(), endDate.getMonth() - 11, 1);

  // Chuyển dữ liệu sang dạng CalendarHeatmap yêu cầu
  const values = Object.entries(stats || {}).map(([date, count]) => ({
    date,
    count,
  }));

  // Thang màu (xanh lá như hình)
  const getColorClass = (count) => {
    if (!count || count === 0) return "fill-gray-200";
    if (count < 2) return "fill-green-200";
    if (count < 4) return "fill-green-400";
    if (count < 6) return "fill-green-600";
    return "fill-green-800";
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md">
      <h2 className="text-lg font-semibold mb-4 text-center">
        Biểu đồ hoạt động học tập theo ngày (12 Tháng Gần Nhất)
      </h2>

      <div className="overflow-x-auto">
        <CalendarHeatmap
          startDate={startDate}
          endDate={endDate}
          values={values}
          showMonthLabels={true}
          showWeekdayLabels={false}
          classForValue={(value) => getColorClass(value?.count)}
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