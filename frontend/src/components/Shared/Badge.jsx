import React from "react";

const VARIANTS = {
	default: "bg-gray-100 text-gray-700 border-gray-200",
	primary: "bg-purple-100 text-purple-700 border-purple-200",
	secondary: "bg-purple-50 text-purple-600 border-purple-100",
	success: "bg-green-100 text-green-700 border-green-200",
	warning: "bg-amber-100 text-amber-700 border-amber-200",
	danger: "bg-red-100 text-red-700 border-red-200",
	info: "bg-blue-100 text-blue-700 border-blue-200",
	outline: "bg-transparent border-gray-300 text-gray-600",
	ghost: "bg-transparent border-transparent text-gray-500 hover:bg-gray-100",
};

const SIZES = {
	xs: "text-[10px] px-1.5 py-0.5 h-5",
	sm: "text-xs px-2.5 py-0.5 h-6",
	md: "text-sm px-3 py-1 h-7",
	lg: "text-base px-4 py-1.5 h-8",
};

export default function Badge({
	children,
	variant = "default",
	size = "sm",
	icon: Icon,
	dot = false,
	className = "",
	...props
}) {
	const variantStyles = VARIANTS[variant] || VARIANTS.default;
	const sizeStyles = SIZES[size] || SIZES.sm;

	return (
		<span
			className={`
                inline-flex items-center gap-1.5 font-medium rounded-full border border-transparent whitespace-nowrap transition-colors
                ${variantStyles}
                ${sizeStyles}
                ${className}
            `}
			{...props}>
			{dot && (
				<span
					className={`w-1.5 h-1.5 rounded-full bg-current opacity-75 shrink-0`}
				/>
			)}
			{Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
			{children}
		</span>
	);
}
