import * as Popover from "@radix-ui/react-popover";
import { ChevronDown } from "lucide-react";

export default function RadixSelect({
	value,
	onChange,
	options,
	disabled = false,
	icon,
	className = "w-[180px]",
}) {
	const selectedLabel =
		options.find((opt) => opt.value === value)?.label || value;

	return (
		<Popover.Root>
			<Popover.Trigger asChild>
				<button
					disabled={disabled}
					className={`flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-white border transition-all duration-200 outline-none ${
						disabled
							? "bg-gray-50 text-gray-400 cursor-not-allowed border-gray-100"
							: "border-gray-200 hover:border-purple-300 hover:bg-gray-50 text-gray-700 data-[state=open]:border-purple-500 data-[state=open]:ring-2 data-[state=open]:ring-purple-100"
					} ${className}`}>
					{/* Left Content: Icon + Text (Truncated) */}
					<div className="flex items-center gap-2 min-w-0 overflow-hidden">
						{icon && (
							<span
								className={`shrink-0 ${
									disabled ? "opacity-50" : "text-gray-500"
								}`}>
								{icon}
							</span>
						)}
						<span
							className="text-sm font-medium truncate"
							title={selectedLabel}>
							{selectedLabel}
						</span>
					</div>

					{/* Right Content: Chevron */}
					{!disabled && (
						<ChevronDown className="w-4 h-4 text-gray-400 transition-transform duration-200 ease-in-out shrink-0 ml-1" />
					)}
				</button>
			</Popover.Trigger>

			<Popover.Portal>
				<Popover.Content
					className="min-w-[var(--radix-popover-trigger-width)] bg-white rounded-xl shadow-xl border border-gray-100 p-1 z-[9999] animate-in fade-in zoom-in-95 duration-200"
					sideOffset={5}
					align="start">
					<div className="flex flex-col">
						{options.map((option) => (
							<button
								key={option.value}
								onClick={() => {
									onChange(option.value);
									document.body.click();
								}}
								className={`text-left px-3 py-2 text-sm rounded-lg transition-colors truncate ${
									option.value === value
										? "text-purple-600 font-bold bg-purple-50"
										: "text-gray-600 font-medium hover:bg-gray-50"
								}`}>
								{option.label}
							</button>
						))}
					</div>
				</Popover.Content>
			</Popover.Portal>
		</Popover.Root>
	);
}
