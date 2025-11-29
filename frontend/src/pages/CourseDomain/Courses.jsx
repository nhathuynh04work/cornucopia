import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
	Search,
	Plus,
	Filter,
	SlidersHorizontal,
	Star,
	ChevronDown,
	X,
	PanelLeftClose,
	PanelLeftOpen,
	ChevronLeft,
	ChevronRight,
	ArrowUpDown,
} from "lucide-react";
import CourseCard from "@/components/Courses/CourseCard";
import PermissionGate from "@/components/Shared/PermissionGate";
import PageHeader from "@/components/Shared/PageHeader";
import RadixSelect from "@/components/Shared/RadixSelect";
import { PERMISSIONS } from "@/lib/constants";

// --- MOCK DATA ---
const generateMockCourses = () => {
	const baseCourses = [
		{
			title: "Complete React Developer in 2025 (w/ Redux, Hooks, GraphQL)",
			coverUrl:
				"https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop",
			price: 1299000,
			user: "Andrei Neagoie",
			level: "ADVANCED",
			language: "en",
			rating: 4.8,
			duration: 154800, // 43 hours
			lessons: 342,
		},
		{
			title: "Japanese N5-N4: Tiếng Nhật cơ bản cho người mới bắt đầu",
			coverUrl:
				"https://images.unsplash.com/photo-1528164344705-47542687000d?q=80&w=2092&auto=format&fit=crop",
			price: 599000,
			user: "Yuki Sensei",
			level: "BEGINNER",
			language: "ja",
			rating: 4.9,
			duration: 86400, // 24 hours
			lessons: 120,
		},
		{
			title: "Mastering English Pronunciation: Giọng Mỹ chuẩn",
			coverUrl:
				"https://images.unsplash.com/photo-1543165796-5426273eaab3?q=80&w=2070&auto=format&fit=crop",
			price: 0,
			user: "Rachel's English",
			level: "ALL_LEVELS",
			language: "en",
			rating: 4.7,
			duration: 18000, // 5 hours
			lessons: 45,
		},
		{
			title: "Chinese for Business: Tiếng Trung thương mại",
			coverUrl:
				"https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=2070&auto=format&fit=crop",
			price: 1999000,
			user: "Wang Li",
			level: "INTERMEDIATE",
			language: "zh",
			rating: 4.5,
			duration: 108000, // 30 hours
			lessons: 88,
		},
		{
			title: "Korean 101: Tiếng Hàn nhập môn",
			coverUrl:
				"https://images.unsplash.com/photo-1517154421773-052f8c46b91d?q=80&w=2070&auto=format&fit=crop",
			price: 299000,
			user: "Kim Jisoo",
			level: "BEGINNER",
			language: "ko",
			rating: 4.6,
			duration: 43200, // 12 hours
			lessons: 60,
		},
		{
			title: "IELTS Writing Task 2 Masterclass",
			coverUrl:
				"https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=2073&auto=format&fit=crop",
			price: 799000,
			user: "Simon IELTS",
			level: "ADVANCED",
			language: "en",
			rating: 4.9,
			duration: 28800, // 8 hours
			lessons: 35,
		},
	];

	let data = [];
	for (let i = 0; i < 4; i++) {
		data = [
			...data,
			...baseCourses.map((c, idx) => ({
				...c,
				id: i * 6 + idx + 1,
				title: `${c.title} ${i > 0 ? `(Part ${i + 1})` : ""}`,
				_count: {
					enrollments: Math.floor(Math.random() * 10000) + 100,
				},
				status: "PUBLIC",
				user: { name: c.user, avatarUrl: null },
				stats: {
					rating: c.rating,
					ratingCount: Math.floor(Math.random() * 5000),
				},
			})),
		];
	}
	return data;
};

const MOCK_COURSES = generateMockCourses();

// --- MOCK HOOK ---
function useMockCourses(filters, page = 1, limit = 6, sort) {
	const filteredData = useMemo(() => {
		let data = [...MOCK_COURSES];

		if (filters.search) {
			data = data.filter((c) =>
				c.title.toLowerCase().includes(filters.search.toLowerCase())
			);
		}
		if (filters.level?.length > 0) {
			data = data.filter((c) => filters.level.includes(c.level));
		}
		if (filters.language?.length > 0) {
			data = data.filter((c) => filters.language.includes(c.language));
		}
		if (filters.rating) {
			data = data.filter((c) => c.stats.rating >= Number(filters.rating));
		}
		if (filters.price === "free") {
			data = data.filter((c) => c.price === 0);
		} else if (filters.price === "paid") {
			data = data.filter((c) => c.price > 0);
		}

		if (sort === "newest") {
			data.sort((a, b) => b.id - a.id);
		} else if (sort === "price_asc") {
			data.sort((a, b) => a.price - b.price);
		} else if (sort === "price_desc") {
			data.sort((a, b) => b.price - a.price);
		} else if (sort === "rating") {
			data.sort((a, b) => b.stats.rating - a.stats.rating);
		}

		return data;
	}, [filters, sort]);

	const totalItems = filteredData.length;
	const totalPages = Math.ceil(totalItems / limit);
	const paginatedData = filteredData.slice((page - 1) * limit, page * limit);

	return {
		data: paginatedData,
		pagination: { totalItems, totalPages, currentPage: page },
		isLoading: false,
	};
}

// --- COMPONENTS ---

const FilterSection = ({ title, children, isOpen = true }) => {
	const [open, setOpen] = useState(isOpen);
	return (
		<div className="py-3 border-b border-gray-100 last:border-0">
			<button
				onClick={() => setOpen(!open)}
				className="flex items-center justify-between w-full group"
			>
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

const CheckboxItem = ({ label, count, checked, onChange }) => (
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
			}`}
		>
			{label}
		</span>
		{count !== undefined && (
			<span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full font-medium">
				{count}
			</span>
		)}
	</label>
);

const RadioItem = ({ label, name, checked, onChange, icon }) => (
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
			}`}
		>
			{icon}
			{label}
		</div>
	</label>
);

const SORT_OPTIONS = [
	{ value: "popular", label: "Phổ biến nhất" },
	{ value: "newest", label: "Mới nhất" },
	{ value: "rating", label: "Đánh giá cao nhất" },
	{ value: "price_asc", label: "Giá thấp đến cao" },
	{ value: "price_desc", label: "Giá cao đến thấp" },
];

export default function Courses() {
	const navigate = useNavigate();
	const [search, setSearch] = useState("");
	const [selectedLevels, setSelectedLevels] = useState([]);
	const [selectedLanguages, setSelectedLanguages] = useState([]);
	const [minRating, setMinRating] = useState(null);
	const [priceFilter, setPriceFilter] = useState("all");
	const [sort, setSort] = useState("newest");
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);

	const filters = useMemo(
		() => ({
			search,
			level: selectedLevels,
			language: selectedLanguages,
			rating: minRating,
			price: priceFilter,
		}),
		[search, selectedLevels, selectedLanguages, minRating, priceFilter]
	);

	const { data: courses, pagination } = useMockCourses(
		filters,
		currentPage,
		6,
		sort
	);

	const toggleFilter = (setter, value) => {
		setter((prev) =>
			prev.includes(value)
				? prev.filter((item) => item !== value)
				: [...prev, value]
		);
		setCurrentPage(1);
	};

	const clearAllFilters = () => {
		setSearch("");
		setSelectedLevels([]);
		setSelectedLanguages([]);
		setMinRating(null);
		setPriceFilter("all");
		setCurrentPage(1);
	};

	const handleCreateCourse = () => {
		navigate("/courses/new");
	};

	const SidebarContent = () => (
		<div className="flex flex-col h-full">
			<div className="flex items-center justify-between mb-4 shrink-0">
				<h2 className="font-bold text-lg flex items-center gap-2 text-gray-900">
					<SlidersHorizontal className="w-5 h-5 text-purple-600" />
					Bộ lọc
				</h2>
				{(selectedLevels.length > 0 ||
					selectedLanguages.length > 0 ||
					minRating ||
					priceFilter !== "all") && (
					<button
						onClick={clearAllFilters}
						className="text-xs font-semibold text-purple-600 hover:text-purple-700 hover:underline"
					>
						Xóa tất cả
					</button>
				)}
			</div>

			<div className="flex-1 overflow-y-auto pr-1 space-y-1 scroll-container hide-scrollbar">
				{/* Ratings */}
				<FilterSection title="Đánh giá">
					{[4.5, 4.0, 3.5, 3.0].map((rating) => (
						<RadioItem
							key={rating}
							name="rating"
							label={`Từ ${rating} sao`}
							checked={minRating === rating}
							onChange={() => setMinRating(rating)}
							icon={
								<div className="flex gap-0.5">
									{[1, 2, 3, 4, 5].map((s) => (
										<Star
											key={s}
											className={`w-3 h-3 ${
												s <= Math.floor(rating)
													? "fill-amber-400 text-amber-400"
													: s === Math.ceil(rating) &&
														  rating % 1 !== 0
														? "fill-amber-400 text-amber-400 opacity-50"
														: "text-gray-300"
											}`}
										/>
									))}
								</div>
							}
						/>
					))}
					<RadioItem
						name="rating"
						label="Tất cả"
						checked={minRating === null}
						onChange={() => setMinRating(null)}
					/>
				</FilterSection>

				{/* Level */}
				<FilterSection title="Trình độ">
					<CheckboxItem
						label="Tất cả trình độ"
						checked={selectedLevels.includes("ALL_LEVELS")}
						onChange={() =>
							toggleFilter(setSelectedLevels, "ALL_LEVELS")
						}
						count={120}
					/>
					<CheckboxItem
						label="Cơ bản"
						checked={selectedLevels.includes("BEGINNER")}
						onChange={() =>
							toggleFilter(setSelectedLevels, "BEGINNER")
						}
						count={45}
					/>
					<CheckboxItem
						label="Trung cấp"
						checked={selectedLevels.includes("INTERMEDIATE")}
						onChange={() =>
							toggleFilter(setSelectedLevels, "INTERMEDIATE")
						}
						count={32}
					/>
					<CheckboxItem
						label="Nâng cao"
						checked={selectedLevels.includes("ADVANCED")}
						onChange={() =>
							toggleFilter(setSelectedLevels, "ADVANCED")
						}
						count={15}
					/>
				</FilterSection>

				{/* Language */}
				<FilterSection title="Ngôn ngữ">
					<CheckboxItem
						label="Tiếng Anh"
						checked={selectedLanguages.includes("en")}
						onChange={() => toggleFilter(setSelectedLanguages, "en")}
						count={80}
					/>
					<CheckboxItem
						label="Tiếng Nhật"
						checked={selectedLanguages.includes("ja")}
						onChange={() => toggleFilter(setSelectedLanguages, "ja")}
						count={24}
					/>
					<CheckboxItem
						label="Tiếng Hàn"
						checked={selectedLanguages.includes("ko")}
						onChange={() => toggleFilter(setSelectedLanguages, "ko")}
						count={18}
					/>
					<CheckboxItem
						label="Tiếng Trung"
						checked={selectedLanguages.includes("zh")}
						onChange={() => toggleFilter(setSelectedLanguages, "zh")}
						count={12}
					/>
				</FilterSection>

				{/* Price */}
				<FilterSection title="Giá khóa học">
					<RadioItem
						name="price"
						label="Tất cả"
						checked={priceFilter === "all"}
						onChange={() => setPriceFilter("all")}
					/>
					<RadioItem
						name="price"
						label="Miễn phí"
						checked={priceFilter === "free"}
						onChange={() => setPriceFilter("free")}
					/>
					<RadioItem
						name="price"
						label="Có phí"
						checked={priceFilter === "paid"}
						onChange={() => setPriceFilter("paid")}
					/>
				</FilterSection>
			</div>
		</div>
	);

	return (
		<div className="min-h-screen bg-gray-50/50">
			{/* --- Page Header --- */}
			<div className="px-6 pt-6 max-w-[1600px] mx-auto">
				<PageHeader
					title="Thư viện khóa học"
					description="Nâng cao kỹ năng với hơn 500+ khóa học từ các chuyên gia hàng đầu."
					action={
						<PermissionGate
							allowedRoles={PERMISSIONS.CREATE_COURSE}
						>
							<button
								onClick={handleCreateCourse}
								className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl transition-colors shadow-sm hover:shadow"
							>
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
							title={isSidebarOpen ? "Ẩn bộ lọc" : "Hiện bộ lọc"}
						>
							{isSidebarOpen ? (
								<PanelLeftClose className="w-5 h-5" />
							) : (
								<PanelLeftOpen className="w-5 h-5" />
							)}
						</button>

						<button
							className="lg:hidden p-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:text-purple-600"
							onClick={() => setIsMobileFilterOpen(true)}
						>
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
								value={search}
								onChange={(e) => setSearch(e.target.value)}
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
						}`}
					>
						<aside className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm w-full h-[calc(100vh-8rem)] flex flex-col">
							<SidebarContent />
						</aside>
					</div>

					{/* --- Content (Right) --- */}
					<div className="flex-1 min-w-0 px-6">
						{courses.length > 0 ? (
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
											setCurrentPage((p) =>
												Math.max(1, p - 1)
											)
										}
										disabled={currentPage === 1}
										className="p-2 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
									>
										<ChevronLeft className="w-5 h-5" />
									</button>

									{Array.from(
										{ length: pagination.totalPages },
										(_, i) => i + 1
									).map((page) => (
										<button
											key={page}
											onClick={() => setCurrentPage(page)}
											className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${
												currentPage === page
													? "bg-purple-600 text-white shadow-lg shadow-purple-200"
													: "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-purple-200"
											}`}
										>
											{page}
										</button>
									))}

									<button
										onClick={() =>
											setCurrentPage((p) =>
												Math.min(
													pagination.totalPages,
													p + 1
												)
											)
										}
										disabled={
											currentPage ===
											pagination.totalPages
										}
										className="p-2 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
									>
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
									onClick={clearAllFilters}
									className="text-purple-600 font-bold hover:underline"
								>
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
								className="p-2 hover:bg-gray-100 rounded-full"
							>
								<X className="w-6 h-6 text-gray-500" />
							</button>
						</div>
						<div className="space-y-6">
							<SidebarContent />
							<button
								onClick={() => setIsMobileFilterOpen(false)}
								className="w-full py-3 bg-purple-600 text-white font-bold rounded-xl sticky bottom-0 shadow-lg"
							>
								Xem {pagination.totalItems} kết quả
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}