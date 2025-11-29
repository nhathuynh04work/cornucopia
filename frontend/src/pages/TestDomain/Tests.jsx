import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
	Search,
	Plus,
	Filter,
	SlidersHorizontal,
	ChevronDown,
	X,
	PanelLeftClose,
	PanelLeftOpen,
	ChevronLeft,
	ChevronRight,
	ArrowUpDown,
} from "lucide-react";
import TestCard from "@/components/Tests/TestCard";
import PermissionGate from "@/components/Shared/PermissionGate";
import PageHeader from "@/components/Shared/PageHeader";
import RadixSelect from "@/components/Shared/RadixSelect";
import { PERMISSIONS } from "@/lib/constants";

// --- MOCK DATA ---
const generateMockTests = () => {
	const baseTests = [
		{
			title: "Kiểm tra năng lực Tiếng Anh đầu vào (Placement Test)",
			description: "Bài kiểm tra đánh giá toàn diện 4 kỹ năng Nghe, Nói, Đọc, Viết.",
			user: "Admin System",
			questionsCount: 50,
			timeLimit: 3600,
			attemptsCount: 5400,
			language: "en",
			level: "ALL_LEVELS",
		},
		{
			title: "Ôn tập Toán Cao Cấp A1 - Chương 1: Ma trận & Định thức",
			description: "Tổng hợp các dạng bài tập trắc nghiệm thường gặp trong đề thi cuối kỳ.",
			user: "Thầy Minh Toán",
			questionsCount: 25,
			timeLimit: 2700,
			attemptsCount: 1200,
			language: "vi",
			level: "INTERMEDIATE",
		},
		{
			title: "Trắc nghiệm IQ & Logic (Tuyển dụng 2025)",
			description: "Bộ câu hỏi IQ chuẩn quốc tế thường dùng trong các bài test tuyển dụng.",
			user: "HR Insider",
			questionsCount: 40,
			timeLimit: 1800,
			attemptsCount: 8500,
			language: "vi",
			level: "ADVANCED",
		},
		{
			title: "Lịch sử Đảng Cộng sản Việt Nam - Ôn thi tốt nghiệp",
			description: "Ngân hàng câu hỏi trắc nghiệm Lịch sử Đảng đầy đủ, chi tiết.",
			user: "Cô Lan Sử",
			questionsCount: 100,
			timeLimit: 5400,
			attemptsCount: 15000,
			language: "vi",
			level: "ALL_LEVELS",
		},
		{
			title: "AWS Cloud Practitioner Practice Exam 2025",
			description: "Simulate the real AWS exam environment. Updated for the latest CLF-C02.",
			user: "Tech Academy",
			questionsCount: 65,
			timeLimit: 5400,
			attemptsCount: 320,
			language: "en",
			level: "ADVANCED",
		},
		{
			title: "Kiến thức chung về Marketing căn bản",
			description: "Test kiến thức nền tảng cho sinh viên năm 1, 2 chuyên ngành QTKD.",
			user: "Marketing Zone",
			questionsCount: 30,
			timeLimit: 1800,
			attemptsCount: 600,
			language: "vi",
			level: "BEGINNER",
		},
	];

	let data = [];
	for (let i = 0; i < 4; i++) {
		data = [
			...data,
			...baseTests.map((t, idx) => ({
				...t,
				id: i * 6 + idx + 1,
				title: `${t.title} ${i > 0 ? `(Set ${i + 1})` : ""}`,
				status: "PUBLIC",
				user: { name: t.user, avatarUrl: null },
			})),
		];
	}
	return data;
};

const MOCK_TESTS = generateMockTests();

// --- MOCK HOOK ---
function useMockTests(filters, page = 1, limit = 6, sort) {
	const filteredData = useMemo(() => {
		let data = [...MOCK_TESTS];

		if (filters.search) {
			data = data.filter((item) =>
				item.title.toLowerCase().includes(filters.search.toLowerCase())
			);
		}
		if (filters.level?.length > 0) {
			data = data.filter((item) => filters.level.includes(item.level));
		}
		if (filters.language?.length > 0) {
			data = data.filter((item) => filters.language.includes(item.language));
		}

		if (sort === "newest") {
			data.sort((a, b) => b.id - a.id);
		} else if (sort === "attempts") {
			data.sort((a, b) => b.attemptsCount - a.attemptsCount);
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
		<span className={`text-sm flex-1 ${checked ? "text-gray-900 font-medium" : "text-gray-600"}`}>
			{label}
		</span>
		{count !== undefined && (
			<span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full font-medium">
				{count}
			</span>
		)}
	</label>
);

const SORT_OPTIONS = [
	{ value: "newest", label: "Mới nhất" },
	{ value: "attempts", label: "Lượt thi nhiều nhất" },
];

export default function Tests() {
	const navigate = useNavigate();
	const [search, setSearch] = useState("");
	const [selectedLevels, setSelectedLevels] = useState([]);
	const [selectedLanguages, setSelectedLanguages] = useState([]);
	const [sort, setSort] = useState("newest");
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);

	const filters = useMemo(
		() => ({
			search,
			level: selectedLevels,
			language: selectedLanguages,
		}),
		[search, selectedLevels, selectedLanguages]
	);

	const { data: tests, pagination } = useMockTests(filters, currentPage, 6, sort);

	const toggleFilter = (setter, value) => {
		setter((prev) =>
			prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
		);
		setCurrentPage(1);
	};

	const clearAllFilters = () => {
		setSearch("");
		setSelectedLevels([]);
		setSelectedLanguages([]);
		setCurrentPage(1);
	};

	const handleCreateTest = () => {
		navigate("/tests/new");
	};

	const SidebarContent = () => (
		<div className="flex flex-col">
			<div className="flex items-center justify-between mb-4">
				<h2 className="font-bold text-lg flex items-center gap-2 text-gray-900">
					<SlidersHorizontal className="w-5 h-5 text-purple-600" />
					Bộ lọc
				</h2>
				{(selectedLevels.length > 0 || selectedLanguages.length > 0) && (
					<button
						onClick={clearAllFilters}
						className="text-xs font-semibold text-purple-600 hover:text-purple-700 hover:underline"
					>
						Xóa tất cả
					</button>
				)}
			</div>

			<div>
				{/* Level */}
				<FilterSection title="Trình độ">
					<CheckboxItem
						label="Tất cả trình độ"
						checked={selectedLevels.includes("ALL_LEVELS")}
						onChange={() => toggleFilter(setSelectedLevels, "ALL_LEVELS")}
						count={12}
					/>
					<CheckboxItem
						label="Cơ bản"
						checked={selectedLevels.includes("BEGINNER")}
						onChange={() => toggleFilter(setSelectedLevels, "BEGINNER")}
						count={45}
					/>
					<CheckboxItem
						label="Trung bình"
						checked={selectedLevels.includes("INTERMEDIATE")}
						onChange={() => toggleFilter(setSelectedLevels, "INTERMEDIATE")}
						count={24}
					/>
					<CheckboxItem
						label="Nâng cao"
						checked={selectedLevels.includes("ADVANCED")}
						onChange={() => toggleFilter(setSelectedLevels, "ADVANCED")}
						count={8}
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
						label="Tiếng Việt"
						checked={selectedLanguages.includes("vi")}
						onChange={() => toggleFilter(setSelectedLanguages, "vi")}
						count={120}
					/>
					<CheckboxItem
						label="Tiếng Nhật"
						checked={selectedLanguages.includes("ja")}
						onChange={() => toggleFilter(setSelectedLanguages, "ja")}
						count={24}
					/>
				</FilterSection>
			</div>
		</div>
	);

	return (
		<div className="min-h-screen bg-gray-50/50">
			<div className="px-6 pt-6 max-w-[1600px] mx-auto">
				<PageHeader
					title="Thư viện đề thi"
					description="Hàng ngàn đề thi trắc nghiệm giúp bạn ôn luyện kiến thức hiệu quả."
					action={
						<PermissionGate allowedRoles={PERMISSIONS.CREATE_TEST}>
							<button
								onClick={handleCreateTest}
								className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl transition-colors shadow-sm hover:shadow"
							>
								<Plus className="w-4 h-4" />
								Tạo đề thi
							</button>
						</PermissionGate>
					}
				/>
			</div>

			<div className="sticky top-0 z-20 bg-gray-50/95 backdrop-blur-md px-6 py-4 transition-all">
				<div className="max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
					<div className="flex items-center gap-3 w-full md:w-auto">
						<button
							onClick={() => setIsSidebarOpen(!isSidebarOpen)}
							className="hidden lg:flex items-center justify-center p-2.5 bg-white border border-gray-200 hover:border-purple-300 hover:bg-purple-50 text-gray-600 hover:text-purple-600 rounded-xl transition-all shadow-sm"
							title={isSidebarOpen ? "Ẩn bộ lọc" : "Hiện bộ lọc"}
						>
							{isSidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
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
							<span className="font-bold text-gray-900">{pagination.totalItems}</span> đề thi
						</span>

						<div className="relative flex-1 max-w-md group">
							<input
								type="text"
								placeholder="Tìm kiếm đề thi..."
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
					<div
						className={`hidden lg:block shrink-0 sticky top-24 transition-all duration-300 ease-in-out ${
							isSidebarOpen
								? "w-[300px] opacity-100 translate-x-0 pl-6 pr-2"
								: "w-0 opacity-0 -translate-x-10 overflow-hidden pl-0 pr-0"
						}`}
					>
						<aside className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm w-full">
							<SidebarContent />
						</aside>
					</div>

					<div className="flex-1 min-w-0 px-6">
						{tests.length > 0 ? (
							<>
								<div className="grid grid-cols-1 gap-4">
									{tests.map((test) => (
										<div key={test.id}>
											<TestCard test={test} />
										</div>
									))}
								</div>

								<div className="mt-8 flex items-center justify-center gap-2">
									<button
										onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
										disabled={currentPage === 1}
										className="p-2 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
									>
										<ChevronLeft className="w-5 h-5" />
									</button>
									{Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
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
										onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
										disabled={currentPage === pagination.totalPages}
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
								<h3 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy kết quả</h3>
								<button onClick={clearAllFilters} className="text-purple-600 font-bold hover:underline">
									Xóa tất cả bộ lọc
								</button>
							</div>
						)}
					</div>
				</div>
			</div>

            {/* Mobile Filter Drawer logic */}
            {isMobileFilterOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileFilterOpen(false)} />
                    <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl p-6 overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-bold text-xl">Bộ lọc</h2>
                            <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 rounded-full hover:bg-gray-100"><X className="w-6 h-6" /></button>
                        </div>
                        <div className="space-y-6">
                            <SidebarContent />
                            <button onClick={() => setIsMobileFilterOpen(false)} className="w-full py-3 bg-purple-600 text-white font-bold rounded-xl shadow-lg">Xem kết quả</button>
                        </div>
                    </div>
                </div>
            )}
		</div>
	);
}