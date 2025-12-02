export default function ChartTooltip({ active, payload, label, formatter }) {
	if (active && payload && payload.length) {
		return (
			<div className="bg-white p-3 border border-gray-200 rounded-xl shadow-lg text-sm z-50 min-w-[150px]">
				{label && (
					<p className="font-bold text-gray-900 mb-2">{label}</p>
				)}
				<div className="space-y-1">
					{payload.map((entry, index) => (
						<p
							key={index}
							className="text-xs font-medium flex items-center justify-between gap-4"
							style={{
								color:
									entry.color || entry.stroke || entry.fill,
							}}>
							<span className="flex items-center gap-2">
								<span
									className="w-2 h-2 rounded-full"
									style={{
										backgroundColor:
											entry.color ||
											entry.stroke ||
											entry.fill,
									}}
								/>
								{entry.name}:
							</span>
							<span className="font-bold text-gray-700">
								{formatter
									? formatter(entry.value)
									: entry.value.toLocaleString()}
							</span>
						</p>
					))}
				</div>
			</div>
		);
	}
	return null;
}
