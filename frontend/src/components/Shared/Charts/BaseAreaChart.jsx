import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import ChartTooltip from "./ChartTooltip";
import { formatNumberCompact } from "@/lib/formatters";

export default function BaseAreaChart({
	data,
	categories, // Array of { key, name, color }
	dataKey = "name",
	formatter,
	height = "100%",
	className = "",
}) {
	return (
		<div className={`w-full h-full ${className}`}>
			<ResponsiveContainer width="100%" height={height}>
				<AreaChart
					data={data}
					margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
					<defs>
						{categories.map((cat) => (
							<linearGradient
								key={cat.key}
								id={`gradient-${cat.key}`}
								x1="0"
								y1="0"
								x2="0"
								y2="1">
								<stop
									offset="5%"
									stopColor={cat.color}
									stopOpacity={0.3}
								/>
								<stop
									offset="95%"
									stopColor={cat.color}
									stopOpacity={0}
								/>
							</linearGradient>
						))}
					</defs>
					<CartesianGrid
						strokeDasharray="3 3"
						vertical={false}
						stroke="#f3f4f6"
					/>
					<XAxis
						dataKey={dataKey}
						axisLine={false}
						tickLine={false}
						tick={{ fill: "#9ca3af", fontSize: 11 }}
						dy={10}
					/>
					<YAxis
						axisLine={false}
						tickLine={false}
						tick={{ fill: "#9ca3af", fontSize: 11 }}
						tickFormatter={formatNumberCompact}
					/>
					<Tooltip content={<ChartTooltip formatter={formatter} />} />
					{categories.map((cat) => (
						<Area
							key={cat.key}
							type="monotone"
							dataKey={cat.key}
							name={cat.name}
							stroke={cat.color}
							fillOpacity={1}
							fill={`url(#gradient-${cat.key})`}
							strokeWidth={3}
						/>
					))}
				</AreaChart>
			</ResponsiveContainer>
		</div>
	);
}
