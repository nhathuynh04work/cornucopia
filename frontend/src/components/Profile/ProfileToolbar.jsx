import { Search, Filter, Plus } from "lucide-react";
import RadixSelect from "@/components/Shared/RadixSelect";

const SORT_OPTIONS = [
	{ value: "newest", label: "Mới nhất" },
	{ value: "oldest", label: "Cũ nhất" },
];

export default function ProfileToolbar({
	searchTerm,
	onSearchChange,
	sortBy,
	onSortChange,
	activeTabLabel,
	isOwnProfile,
}) {
	return (
		<div className="flex flex-col sm:flex-row gap-4 mb-6">
			<div className="relative flex-1 group w-full">
				<input
					type="text"
					placeholder={`Tìm kiếm ${activeTabLabel.toLowerCase()}...`}
					value={searchTerm}
					onChange={(e) => onSearchChange(e.target.value)}
					className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all shadow-sm"
				/>
				<Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-purple-500 transition-colors" />
			</div>

			<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
				<RadixSelect
					value={sortBy}
					onChange={onSortChange}
					options={SORT_OPTIONS}
					icon={<Filter className="w-4 h-4" />}
					className="w-full sm:w-[160px]"
				/>

				{isOwnProfile && (
					<button className="flex justify-center items-center gap-1.5 px-3 py-2 bg-purple-600 text-white rounded-lg text-xs font-bold hover:bg-purple-700 shadow-md shadow-purple-100 transition-all shrink-0 w-full sm:w-auto">
						<Plus className="w-4 h-4" />
						<span>Tạo mới</span>
					</button>
				)}
			</div>
		</div>
	);
}
