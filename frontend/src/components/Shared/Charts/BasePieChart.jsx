import { useMemo } from "react";
import {
	PieChart,
	Pie,
	Cell,
	Tooltip,
	ResponsiveContainer,
	Legend,
} from "recharts";
import ChartTooltip from "./ChartTooltip";

export default function BasePieChart({
	data,
	dataKey = "value",
	nameKey = "name",
	colors = {}, // Object map or Array
	innerRadius = 0,
	outerRadius = 100,
	centerLabel, // String or Component
	showLegend = true,
	height = "100%",
}) {
	const total = useMemo(
		() => data.reduce((sum, item) => sum + (item[dataKey] || 0), 0),
		[data, dataKey]
	);

	// Helper to get color: supports object map (by name) or array index
	const getColor = (entry, index) => {
		if (Array.isArray(colors)) return colors[index % colors.length];
		return colors[entry[nameKey]] || "#ccc";
	};

	return (
		<div className="w-full h-full relative">
			<ResponsiveContainer width="100%" height={height}>
				<PieChart>
					<Pie
						data={data}
						cx="50%"
						cy="50%"
						innerRadius={innerRadius}
						outerRadius={outerRadius}
						paddingAngle={5}
						dataKey={dataKey}
						nameKey={nameKey}
						stroke="none">
						{data.map((entry, index) => (
							<Cell
								key={`cell-${index}`}
								fill={entry.color || getColor(entry, index)}
							/>
						))}
					</Pie>
					<Tooltip content={<ChartTooltip />} />
					{showLegend && (
						<Legend
							verticalAlign="bottom"
							height={36}
							iconType="circle"
							formatter={(value) => (
								<span className="text-xs font-medium text-gray-600 ml-1">
									{value}
								</span>
							)}
						/>
					)}
				</PieChart>
			</ResponsiveContainer>

			{/* Center Label (Donut Chart) */}
			{centerLabel && (
				<div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-6">
					<span className="text-gray-400 text-xs font-medium uppercase tracking-wider">
						{centerLabel}
					</span>
					<span className="text-3xl font-extrabold text-gray-900 mt-1">
						{total.toLocaleString()}
					</span>
				</div>
			)}
		</div>
	);
}
