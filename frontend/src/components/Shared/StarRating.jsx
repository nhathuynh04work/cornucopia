import { Star } from "lucide-react";

export default function StarRating({ rating, size = 16 }) {
	return (
		<div className="flex items-center gap-0.5">
			{[1, 2, 3, 4, 5].map((index) => {
				// Calculate how much of this specific star should be filled
				// e.g., rating 4.6:
				// index 1: (4.6 - 0) * 100 = 460% -> clamped to 100%
				// index 4: (4.6 - 3) * 100 = 160% -> clamped to 100%
				// index 5: (4.6 - 4) * 100 = 60%  -> clamped to 60%
				const fillPercentage = Math.max(
					0,
					Math.min(100, (rating - (index - 1)) * 100)
				);

				return (
					<div key={index} className="relative inline-block">
						{/* Background: Empty Star (Gray) */}
						<Star
							size={size}
							className="text-gray-300 fill-gray-100"
							strokeWidth={1.5}
						/>

						{/* Foreground: Filled Star (Amber) - Masked by Width */}
						<div
							className="absolute top-0 left-0 overflow-hidden h-full"
							style={{ width: `${fillPercentage}%` }}>
							<Star
								size={size}
								className="text-amber-400 fill-amber-400"
								strokeWidth={1.5}
							/>
						</div>
					</div>
				);
			})}
		</div>
	);
}
