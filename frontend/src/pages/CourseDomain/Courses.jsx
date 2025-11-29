import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	Search,
	Plus,
	Filter,
	PanelLeftClose,
	PanelLeftOpen,
	ChevronLeft,
	ChevronRight,
	ArrowUpDown,
	X,
} from "lucide-react";
import CourseCard from "@/components/Courses/CourseCard";
import PermissionGate from "@/components/Shared/PermissionGate";
import PageHeader from "@/components/Shared/PageHeader";
import RadixSelect from "@/components/Shared/RadixSelect";
import { PERMISSIONS } from "@/lib/constants";
import { useResourceFilters } from "@/hooks/useResourceFilters";
import { useGetCourses } from "@/hooks/useCourseQuery";
import CourseFilterSidebar from "@/components/Courses/CourseFilterSidebar";

const SORT_OPTIONS = [
	{ value: "popular", label: "Phổ biến nhất" },
	{ value: "newest", label: "Mới nhất" },
	{ value: "rating", label: "Đánh giá cao nhất" },
	{ value: "price_asc", label: "Giá thấp đến cao" },
	{ value: "price_desc", label: "Giá cao đến thấp" },
];

export default function Courses() {
	const navigate = useNavigate();
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

	const {
		searchTerm,
		setSearchTerm,
		debouncedSearch,
		sort,
		setSort,
		page,
		setPage,
		limit,
		filters,
		setFilter,
		toggleFilterArray,
		clearFilters,
	} = useResourceFilters({ defaultSort: "newest", defaultLimit: 6 });

	const queryParams = {
		page,
		limit,
		sort,
		search: debouncedSearch,
		level: filters.level,
		language: filters.language,
		rating: filters.rating,
		price: filters.price,
		status: "PUBLIC",
	};

	const { data, isLoading } = useGetCourses(queryParams);
	console.log(data);
	const courses = data?.data || [];
	const pagination = data?.pagination || {
		totalItems: 0,
		totalPages: 1,
		currentPage: 1,
	};

	const handleCreateCourse = () => {
		navigate("/courses/new");
	};

	return (
		<div className="min-h-screen bg-gray-50/50">
			{/* --- Page Header --- */}
			<div className="px-6 pt-6 max-w-[1600px] mx-auto">
				<PageHeader
					title="Thư viện khóa học"
					description="Nâng cao kỹ năng với hơn 500+ khóa học từ các chuyên gia hàng đầu."
					action={
						<PermissionGate
							allowedRoles={PERMISSIONS.CREATE_COURSE}>
							<button
								onClick={handleCreateCourse}
								className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl transition-colors shadow-sm hover:shadow">
								<Plus className="w-4 h-4" />
								Tạo khóa học
							</button>
						</PermissionGate>
					}
				/>
			</div>

			{/* --- Control Bar --- */}
			<div className="sticky top-0 z-20 bg-gray-50/95 backdrop-blur-md px-6 py-4 transition-all">
				<div className="max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
					<div className="flex items-center gap-3 w-full md:w-auto">
						<button
							onClick={() => setIsSidebarOpen(!isSidebarOpen)}
							className="hidden lg:flex items-center justify-center p-2.5 bg-white border border-gray-200 hover:border-purple-300 hover:bg-purple-50 text-gray-600 hover:text-purple-600 rounded-xl transition-all shadow-sm"
							title={isSidebarOpen ? "Ẩn bộ lọc" : "Hiện bộ lọc"}>
							{isSidebarOpen ? (
								<PanelLeftClose className="w-5 h-5" />
							) : (
								<PanelLeftOpen className="w-5 h-5" />
							)}
						</button>

						<button
							className="lg:hidden p-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:text-purple-600"
							onClick={() => setIsMobileFilterOpen(true)}>
							<Filter className="w-5 h-5" />
						</button>

						<div className="hidden md:block w-[180px]">
							<RadixSelect
								value={sort}
								onChange={setSort}
								options={SORT_OPTIONS}
								icon={<ArrowUpDown className="w-4 h-4" />}
								className="w-full"
							/>
						</div>
					</div>

					<div className="flex items-center gap-4 flex-1 justify-end ml-auto w-full md:w-auto">
						<span className="text-sm text-gray-500 whitespace-nowrap hidden lg:inline">
							<span className="font-bold text-gray-900">
								{pagination.totalItems}
							</span>{" "}
							kết quả
						</span>

						<div className="relative flex-1 max-w-md group">
							<input
								type="text"
								placeholder="Tìm kiếm khóa học..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all shadow-sm group-hover:border-gray-300"
							/>
							<Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-purple-500 transition-colors" />
						</div>
					</div>
				</div>
			</div>

			<div className="max-w-[1600px] mx-auto py-6">
				<div className={`flex items-start transition-all duration-300`}>
					{/* --- Sidebar (Left) --- */}
					<div
						className={`hidden lg:block shrink-0 sticky top-24 transition-all duration-300 ease-in-out ${
							isSidebarOpen
								? "w-[300px] opacity-100 translate-x-0 pl-6 pr-2"
								: "w-0 opacity-0 -translate-x-10 overflow-hidden pl-0 pr-0"
						}`}>
						<aside className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm w-full h-[calc(100vh-8rem)] flex flex-col">
							<CourseFilterSidebar
								filters={filters}
								toggleFilterArray={toggleFilterArray}
								setFilter={setFilter}
								clearFilters={clearFilters}
							/>
						</aside>
					</div>

					{/* --- Content (Right) --- */}
					<div className="flex-1 min-w-0 px-6">
						{isLoading ? (
							<div className="flex justify-center py-20">
								<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
							</div>
						) : courses.length > 0 ? (
							<>
								<div className="grid grid-cols-1 gap-4">
									{courses.map((course) => (
										<div key={course.id}>
											<CourseCard course={course} />
										</div>
									))}
								</div>

								{/* Pagination */}
								<div className="mt-8 flex items-center justify-center gap-2">
									<button
										onClick={() =>
											setPage((p) => Math.max(1, p - 1))
										}
										disabled={page === 1}
										className="p-2 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
										<ChevronLeft className="w-5 h-5" />
									</button>

									{Array.from(
										{ length: pagination.totalPages },
										(_, i) => i + 1
									).map((p) => (
										<button
											key={p}
											onClick={() => setPage(p)}
											className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${
												page === p
													? "bg-purple-600 text-white shadow-lg shadow-purple-200"
													: "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-purple-200"
											}`}>
											{p}
										</button>
									))}

									<button
										onClick={() =>
											setPage((p) =>
												Math.min(
													pagination.totalPages,
													p + 1
												)
											)
										}
										disabled={
											page === pagination.totalPages
										}
										className="p-2 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
										<ChevronRight className="w-5 h-5" />
									</button>
								</div>
							</>
						) : (
							<div className="bg-white rounded-3xl border border-gray-200 p-12 text-center shadow-sm">
								<div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
									<Search className="w-10 h-10" />
								</div>
								<h3 className="text-xl font-bold text-gray-900 mb-2">
									Không tìm thấy kết quả
								</h3>
								<p className="text-gray-500 max-w-md mx-auto mb-6">
									Không có khóa học nào phù hợp với bộ lọc
									hiện tại.
								</p>
								<button
									onClick={clearFilters}
									className="text-purple-600 font-bold hover:underline">
									Xóa tất cả bộ lọc
								</button>
							</div>
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
					<div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl p-6 overflow-y-auto animate-in slide-in-from-right duration-300">
						<div className="flex items-center justify-between mb-6">
							<h2 className="font-bold text-xl">Bộ lọc</h2>
							<button
								onClick={() => setIsMobileFilterOpen(false)}
								className="p-2 hover:bg-gray-100 rounded-full">
								<X className="w-6 h-6 text-gray-500" />
							</button>
						</div>
						<div className="space-y-6">
							<CourseFilterSidebar
								filters={filters}
								toggleFilterArray={toggleFilterArray}
								setFilter={setFilter}
								clearFilters={clearFilters}
							/>
							<button
								onClick={() => setIsMobileFilterOpen(false)}
								className="w-full py-3 bg-purple-600 text-white font-bold rounded-xl sticky bottom-0 shadow-lg">
								Xem {pagination.totalItems} kết quả
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
