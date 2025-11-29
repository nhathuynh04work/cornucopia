import { useState } from "react";
import { ChevronDown } from "lucide-react";

export const FilterSection = ({ title, children, isOpen = true }) => {
	const [open, setOpen] = useState(isOpen);
	return (
		<div className="py-3 border-b border-gray-100 last:border-0">
			<button
				onClick={() => setOpen(!open)}
				className="flex items-center justify-between w-full group">
				<h3 className="font-bold text-gray-900 group-hover:text-purple-700 transition-colors text-sm">
					{title}
				</h3>
				<ChevronDown
					className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
						open ? "rotate-180" : ""
					}`}
				/>
			</button>
			{open && (
				<div className="space-y-1 mt-3 animate-in slide-in-from-top-1 duration-200">
					{children}
				</div>
			)}
		</div>
	);
};

export const CheckboxItem = ({ label, count, checked, onChange }) => (
	<label className="flex items-center gap-3 cursor-pointer group select-none py-1 hover:bg-gray-50 rounded-lg px-1 -mx-1 transition-colors">
		<input
			type="checkbox"
			className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer accent-purple-600"
			checked={checked}
			onChange={onChange}
		/>
		<span
			className={`text-sm flex-1 ${
				checked ? "text-gray-900 font-medium" : "text-gray-600"
			}`}>
			{label}
		</span>
		{count !== undefined && (
			<span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full font-medium">
				{count}
			</span>
		)}
	</label>
);

export const RadioItem = ({ label, name, checked, onChange, icon }) => (
	<label className="flex items-center gap-3 cursor-pointer group select-none py-1 hover:bg-gray-50 rounded-lg px-1 -mx-1 transition-colors">
		<input
			type="radio"
			name={name}
			className="w-4 h-4 border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer accent-purple-600"
			checked={checked}
			onChange={onChange}
		/>
		<div
			className={`text-sm flex items-center gap-2 ${
				checked ? "text-gray-900 font-medium" : "text-gray-600"
			}`}>
			{icon}
			{label}
		</div>
	</label>
);
