import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Legend,
} from "recharts";
import ChartTooltip from "./ChartTooltip";
import { formatNumberCompact } from "@/lib/formatters";

export default function BaseLineChart({
	data,
	categories, // Array of { key, name, color }
	dataKey = "name",
	formatter,
	height = "100%",
}) {
	return (
		<ResponsiveContainer width="100%" height={height}>
			<LineChart
				data={data}
				margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
				<CartesianGrid
					strokeDasharray="3 3"
					stroke="#f3f4f6"
					vertical={false}
				/>
				<XAxis
					dataKey={dataKey}
					stroke="#9ca3af"
					fontSize={12}
					tickLine={false}
					axisLine={false}
					dy={10}
				/>
				<YAxis
					stroke="#9ca3af"
					fontSize={12}
					tickLine={false}
					axisLine={false}
					tickFormatter={formatNumberCompact}
				/>
				<Tooltip content={<ChartTooltip formatter={formatter} />} />
				<Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
				{categories.map((cat) => (
					<Line
						key={cat.key}
						type="monotone"
						dataKey={cat.key}
						name={cat.name}
						stroke={cat.color}
						strokeWidth={2}
						dot={false}
						activeDot={{ r: 6 }}
					/>
				))}
			</LineChart>
		</ResponsiveContainer>
	);
}
