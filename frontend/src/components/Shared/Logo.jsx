export default function Logo({
	showText = true,
	className = "",
	iconSize = "w-8 h-8",
	textSize = "text-xl",
}) {
	return (
		<div className={`flex items-center gap-2 ${className}`}>
			{/* Icon Container */}
			<div className={`${iconSize} relative flex-shrink-0`}>
				<svg
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					className="w-full h-full text-purple-600">
					<path
						d="M5 19C4.44772 19 4 18.5523 4 18C4 13 7 7 13 5L14.5 6.5C9.5 8 7 12.5 7 18C7 18.5523 6.55228 19 6 19H5Z"
						fill="currentColor"
						opacity="0.9"
					/>
					<path
						d="M6 19C6 19 9 19 12 15C14 12.3333 14 8 13 5"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>

					{/* Abundance Elements (Fruits of Knowledge/Dots) */}
					<circle cx="15" cy="9" r="2" className="fill-purple-400" />
					<circle cx="19" cy="7" r="1.5" className="fill-pink-400" />
					<circle cx="18" cy="12" r="1.5" className="fill-blue-400" />
				</svg>

				{/* Optional: Subtle glow behind for dark mode or emphasis */}
				<div className="absolute inset-0 bg-purple-500/20 blur-lg rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
			</div>

			{/* Text Brand */}
			{showText && (
				<span
					className={`font-bold text-gray-900 tracking-tight ${textSize}`}>
					Cornucopia
				</span>
			)}
		</div>
	);
}
