export default function Avatar({ url, name, size = "sm", className = "" }) {
	const imageSrc = url;
	const displayName = name || "User";
	const initial = displayName[0]?.toUpperCase() || "U";

	const sizeClasses = {
		xs: "w-6 h-6 text-xs",
		sm: "w-8 h-8 text-xs",
		md: "w-10 h-10 text-sm",
		lg: "w-16 h-16 text-xl",
		xl: "w-24 h-24 text-3xl",
	};

	return (
		<div
			className={`
                ${sizeClasses[size] || sizeClasses.sm} 
                rounded-full flex-shrink-0 flex items-center justify-center 
                font-bold transition-all overflow-hidden relative
                ${imageSrc ? "bg-gray-100" : "bg-purple-100 text-purple-600"}
                ${className}
            `}>
			{imageSrc ? (
				<img
					src={imageSrc}
					alt={displayName}
					className="w-full h-full object-cover"
					onError={(e) => {
						e.target.style.display = "none";
						e.target.parentElement.classList.add(
							"bg-purple-100",
							"text-purple-600"
						);
					}}
				/>
			) : (
				<span>{initial}</span>
			)}
		</div>
	);
}
