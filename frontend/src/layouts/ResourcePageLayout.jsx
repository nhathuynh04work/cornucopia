import { useState } from "react";
import {
	Search,
	Filter,
	PanelLeftClose,
	PanelLeftOpen,
	ArrowUpDown,
	X,
	Loader2,
} from "lucide-react";
import PageHeader from "@/components/Shared/PageHeader";
import RadixSelect from "@/components/Shared/RadixSelect";

export default function ResourcePageLayout({
	// Header Props
	title,
	description,
	action,

	// Control Bar Props
	searchTerm,
	onSearchChange,
	searchPlaceholder = "Tìm kiếm...",
	sort,
	onSortChange,
	sortOptions = [],
	totalItems = 0,
	itemLabel = "kết quả",

	// Content Props
	filterContent,
	children,
	pagination,
	isLoading = false,
}) {
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

	return (
		<div className="min-h-screen bg-gray-50/50">
			{/* --- Page Header --- */}
			<div className="px-6 pt-6 max-w-[1600px] mx-auto">
				<PageHeader
					title={title}
					description={description}
					action={action}
				/>
			</div>

			{/* --- Sticky Control Bar --- */}
			{/* Removed border-b from here to fix width issue */}
			<div className="sticky top-0 z-20 bg-gray-50/95 backdrop-blur-md transition-all">
				<div className="max-w-[1600px] mx-auto px-6">
					{/* Added padding and border here so it matches content width */}
					<div className="py-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
						<div className="flex items-center gap-3 w-full md:w-auto">
							{/* Desktop Sidebar Toggle */}
							<button
								onClick={() => setIsSidebarOpen(!isSidebarOpen)}
								className="hidden lg:flex items-center justify-center p-2.5 bg-white border border-gray-200 hover:border-purple-300 hover:bg-purple-50 text-gray-600 hover:text-purple-600 rounded-xl transition-all shadow-sm"
								title={
									isSidebarOpen ? "Ẩn bộ lọc" : "Hiện bộ lọc"
								}>
								{isSidebarOpen ? (
									<PanelLeftClose className="w-5 h-5" />
								) : (
									<PanelLeftOpen className="w-5 h-5" />
								)}
							</button>

							{/* Mobile Filter Toggle */}
							<button
								className="lg:hidden p-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:text-purple-600 shadow-sm"
								onClick={() => setIsMobileFilterOpen(true)}>
								<Filter className="w-5 h-5" />
							</button>

							{/* Sort Dropdown */}
							<div className="hidden md:block w-[180px]">
								<RadixSelect
									value={sort}
									onChange={onSortChange}
									options={sortOptions}
									icon={<ArrowUpDown className="w-4 h-4" />}
									className="w-full"
								/>
							</div>
						</div>

						{/* Search & Count */}
						<div className="flex items-center gap-4 flex-1 justify-end ml-auto w-full md:w-auto">
							<span className="text-sm text-gray-500 whitespace-nowrap hidden lg:inline">
								<span className="font-bold text-gray-900">
									{totalItems}
								</span>{" "}
								{itemLabel}
							</span>

							<div className="relative flex-1 max-w-md group">
								<input
									type="text"
									placeholder={searchPlaceholder}
									value={searchTerm}
									onChange={onSearchChange}
									className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all shadow-sm group-hover:border-gray-300"
								/>
								<Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-purple-500 transition-colors" />
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* --- Main Content Layout --- */}
			<div className="max-w-[1600px] mx-auto py-6">
				<div className="flex items-start transition-all duration-300">
					{/* Desktop Sidebar */}
					<div
						className={`hidden lg:block shrink-0 sticky top-24 transition-all duration-300 ease-in-out ${
							isSidebarOpen
								? "w-[300px] opacity-100 translate-x-0 pl-6 pr-2"
								: "w-0 opacity-0 -translate-x-10 overflow-hidden pl-0 pr-0"
						}`}>
						{/* Changed h-[...] to max-h-[...] so it doesn't force stretch */}
						<aside className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm w-full max-h-[calc(100vh-8rem)] flex flex-col overflow-hidden">
							{filterContent}
						</aside>
					</div>

					{/* Grid Content */}
					<div className="flex-1 min-w-0 px-6">
						{isLoading ? (
							<div className="flex justify-center py-20">
								<Loader2 className="w-8 h-8 animate-spin text-purple-600" />
							</div>
						) : (
							<>
								{children}
								{pagination}
							</>
						)}
					</div>
				</div>
			</div>

			{/* --- Mobile Filter Drawer --- */}
			{isMobileFilterOpen && (
				<div className="fixed inset-0 z-50 lg:hidden">
					<div
						className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
						onClick={() => setIsMobileFilterOpen(false)}
					/>
					<div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl p-6 overflow-y-auto animate-in slide-in-from-right duration-300 flex flex-col">
						<div className="flex items-center justify-between mb-6 shrink-0">
							<h2 className="font-bold text-xl">Bộ lọc</h2>
							<button
								onClick={() => setIsMobileFilterOpen(false)}
								className="p-2 hover:bg-gray-100 rounded-full">
								<X className="w-6 h-6 text-gray-500" />
							</button>
						</div>

						{/* Mobile Sidebar Content */}
						<div className="flex-1 overflow-y-auto">
							{filterContent}
						</div>

						<button
							onClick={() => setIsMobileFilterOpen(false)}
							className="w-full py-3 mt-6 bg-purple-600 text-white font-bold rounded-xl shadow-lg shrink-0 sticky bottom-0">
							Xem {totalItems} {itemLabel}
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
