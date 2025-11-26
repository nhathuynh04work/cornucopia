import { Search } from "lucide-react";

export default function FilterBar({
	searchTerm,
	onSearchChange,
	searchPlaceholder = "Search...",
	tabs = [],
	activeTab,
	onTabChange,
	sortOptions = [],
	activeSort,
	onSortChange,
}) {
	return (
		<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
			{/* Search Input */}
			<div className="relative w-full md:w-72 group">
				<input
					type="text"
					placeholder={searchPlaceholder}
					value={searchTerm}
					onChange={(e) => onSearchChange(e.target.value)}
					className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all shadow-sm"
				/>
				<Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-purple-500 transition-colors" />
			</div>

			{/* Filters & Sort */}
			<div className="flex items-center gap-3 overflow-x-auto hide-scrollbar w-full md:w-auto pb-1 md:pb-0">
				{/* Tabs / Categories */}
				{tabs.length > 0 && (
					<div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
						{tabs.map((tab) => (
							<button
								key={tab.value}
								onClick={() => onTabChange(tab.value)}
								className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
									activeTab === tab.value
										? "bg-white text-purple-700 shadow-sm"
										: "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
								}`}>
								{tab.label}
							</button>
						))}
					</div>
				)}

				{/* Sort Dropdown (Native Select for simplicity & mobile) */}
				{sortOptions.length > 0 && (
					<select
						value={activeSort}
						onChange={(e) => onSortChange(e.target.value)}
						className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-600 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 cursor-pointer hover:bg-gray-50">
						{sortOptions.map((opt) => (
							<option key={opt.value} value={opt.value}>
								{opt.label}
							</option>
						))}
					</select>
				)}
			</div>
		</div>
	);
}
