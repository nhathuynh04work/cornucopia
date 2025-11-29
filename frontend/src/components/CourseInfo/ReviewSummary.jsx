import { Star } from "lucide-react";

export default function ReviewSummary({ stats }) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-12 gap-8 border-b border-gray-100 pb-10">
			{/* Score Column */}
			<div className="md:col-span-4 flex flex-col items-center justify-center text-center">
				<div className="text-6xl font-bold text-gray-900 mb-3">
					{stats.rating}
				</div>
				<div className="flex gap-1.5 mb-2">
					{[1, 2, 3, 4, 5].map((star) => (
						<Star
							key={star}
							className={`w-6 h-6 ${
								star <= Math.round(stats.rating)
									? "text-purple-500 fill-purple-500"
									: "text-gray-200 fill-gray-200"
							}`}
						/>
					))}
				</div>
				<div className="text-sm text-gray-500 font-medium">
					{stats.ratingCount} đánh giá
				</div>
			</div>

			{/* Distribution Bars Column */}
			<div className="md:col-span-8 space-y-2.5 pt-2">
				{stats.ratingDist?.map((item) => (
					<div
						key={item.stars}
						className="flex items-center gap-3 text-sm">
						<div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
							<div
								className="h-full bg-purple-500 rounded-full"
								style={{ width: `${item.percent}%` }}
							/>
						</div>
						<div className="flex items-center gap-1 w-12 shrink-0 justify-end">
							<div className="font-bold text-gray-700">
								{item.stars}
							</div>
							<Star className="w-3.5 h-3.5 text-purple-500 fill-purple-500" />
						</div>
						<div className="w-10 text-right text-gray-500 text-xs tabular-nums">
							{item.percent}%
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
