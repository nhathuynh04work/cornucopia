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
import DeckCard from "@/components/Decks/DeckCard";
import PermissionGate from "@/components/Shared/PermissionGate";
import PageHeader from "@/components/Shared/PageHeader";
import RadixSelect from "@/components/Shared/RadixSelect";
import { PERMISSIONS } from "@/lib/constants";

// --- MOCK DATA ---
const generateMockDecks = () => {
	const baseDecks = [
		{
			title: "3000 từ vựng Tiếng Anh thông dụng nhất (Oxford)",
			description:
				"Bộ flashcard không thể thiếu cho người bắt đầu học tiếng Anh.",
			user: "Oxford Learner",
			isPublic: true,
			cardsCount: 3000,
			studySessionCount: 45200,
			language: "en",
			level: "BEGINNER",
		},
		{
			title: "Biển báo giao thông đường bộ Việt Nam 2025",
			description:
				"Ôn thi bằng lái xe A1, A2, B1, B2. Đầy đủ các loại biển báo.",
			user: "Trung tâm sát hạch",
			isPublic: true,
			cardsCount: 150,
			studySessionCount: 8900,
			language: "vi",
			level: "ALL_LEVELS",
		},
		{
			title: "Nguyên tố hóa học & Bảng tuần hoàn",
			description:
				"Ghi nhớ ký hiệu, nguyên tử khối, hóa trị của các nguyên tố.",
			user: "Hóa Học Vui",
			isPublic: true,
			cardsCount: 118,
			studySessionCount: 2300,
			language: "vi",
			level: "INTERMEDIATE",
		},
		{
			title: "Kanji N3 - Soumatome",
			description:
				"Flashcard Kanji N3 theo giáo trình Soumatome. Có ví dụ và âm Hán Việt.",
			user: "Japan Life",
			isPublic: true,
			cardsCount: 650,
			studySessionCount: 12000,
			language: "ja",
			level: "INTERMEDIATE",
		},
		{
			title: "Thuật ngữ Y khoa căn bản",
			description:
				"Dành cho sinh viên Y năm nhất. Các gốc từ, tiền tố, hậu tố.",
			user: "Dr. House",
			isPublic: true,
			cardsCount: 400,
			studySessionCount: 950,
			language: "en",
			level: "ADVANCED",
		},
		{
			title: "Sự kiện lịch sử thế giới thế kỷ 20",
			description:
				"Các mốc thời gian quan trọng trong thế chiến 1, 2 và chiến tranh lạnh.",
			user: "History Channel",
			isPublic: true,
			cardsCount: 50,
			studySessionCount: 400,
			language: "vi",
			level: "ALL_LEVELS",
		},
	];

	let data = [];
	for (let i = 0; i < 4; i++) {
		data = [
			...data,
			...baseDecks.map((d, idx) => ({
				...d,
				id: i * 6 + idx + 1,
				title: `${d.title} ${i > 0 ? `(Part ${i + 1})` : ""}`,
				user: { name: d.user, avatarUrl: null },
			})),
		];
	}
	return data;
};

const MOCK_DECKS = generateMockDecks();

// --- MOCK HOOK ---
function useMockDecks(filters, page = 1, limit = 6, sort) {
	const filteredData = useMemo(() => {
		let data = [...MOCK_DECKS];

		if (filters.search) {
			data = data.filter((item) =>
				item.title.toLowerCase().includes(filters.search.toLowerCase())
			);
		}
		if (filters.level?.length > 0) {
			data = data.filter((item) => filters.level.includes(item.level));
		}
		if (filters.language?.length > 0) {
			data = data.filter((item) =>
				filters.language.includes(item.language)
			);
		}

		if (sort === "newest") {
			data.sort((a, b) => b.id - a.id);
		} else if (sort === "popularity") {
			data.sort((a, b) => b.studySessionCount - a.studySessionCount);
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

const SORT_OPTIONS = [
	{ value: "newest", label: "Mới nhất" },
	{ value: "popularity", label: "Phổ biến nhất" },
];

export default function Decks() {
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

	const { data: decks, pagination } = useMockDecks(
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
		setCurrentPage(1);
	};

	const handleCreateDeck = () => {
		navigate("/decks/new");
	};

	const SidebarContent = () => (
		<div className="flex flex-col">
			<div className="flex items-center justify-between mb-4">
				<h2 className="font-bold text-lg flex items-center gap-2 text-gray-900">
					<SlidersHorizontal className="w-5 h-5 text-purple-600" />
					Bộ lọc
				</h2>
				{(selectedLevels.length > 0 ||
					selectedLanguages.length > 0) && (
					<button
						onClick={clearAllFilters}
						className="text-xs font-semibold text-purple-600 hover:text-purple-700 hover:underline">
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
						onChange={() =>
							toggleFilter(setSelectedLevels, "ALL_LEVELS")
						}
						count={12}
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
						label="Trung bình"
						checked={selectedLevels.includes("INTERMEDIATE")}
						onChange={() =>
							toggleFilter(setSelectedLevels, "INTERMEDIATE")
						}
						count={24}
					/>
					<CheckboxItem
						label="Nâng cao"
						checked={selectedLevels.includes("ADVANCED")}
						onChange={() =>
							toggleFilter(setSelectedLevels, "ADVANCED")
						}
						count={8}
					/>
				</FilterSection>

				{/* Language */}
				<FilterSection title="Ngôn ngữ">
					<CheckboxItem
						label="Tiếng Anh"
						checked={selectedLanguages.includes("en")}
						onChange={() =>
							toggleFilter(setSelectedLanguages, "en")
						}
						count={80}
					/>
					<CheckboxItem
						label="Tiếng Việt"
						checked={selectedLanguages.includes("vi")}
						onChange={() =>
							toggleFilter(setSelectedLanguages, "vi")
						}
						count={120}
					/>
					<CheckboxItem
						label="Tiếng Nhật"
						checked={selectedLanguages.includes("ja")}
						onChange={() =>
							toggleFilter(setSelectedLanguages, "ja")
						}
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
					title="Thư viện Flashcard"
					description="Hàng triệu thẻ ghi nhớ giúp bạn học tập mọi lúc mọi nơi."
					action={
						<PermissionGate allowedRoles={PERMISSIONS.CREATE_DECK}>
							<button
								onClick={handleCreateDeck}
								className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl transition-colors shadow-sm hover:shadow">
								<Plus className="w-4 h-4" />
								Tạo bộ thẻ
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
							bộ thẻ
						</span>

						<div className="relative flex-1 max-w-md group">
							<input
								type="text"
								placeholder="Tìm kiếm bộ thẻ..."
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
						}`}>
						<aside className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm w-full">
							<SidebarContent />
						</aside>
					</div>

					<div className="flex-1 min-w-0 px-6">
						{decks.length > 0 ? (
							<>
								<div className="grid grid-cols-1 gap-4">
									{decks.map((deck) => (
										<div key={deck.id}>
											<DeckCard deck={deck} />
										</div>
									))}
								</div>

								<div className="mt-8 flex items-center justify-center gap-2">
									<button
										onClick={() =>
											setCurrentPage((p) =>
												Math.max(1, p - 1)
											)
										}
										disabled={currentPage === 1}
										className="p-2 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
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
											}`}>
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
								<button
									onClick={clearAllFilters}
									className="text-purple-600 font-bold hover:underline">
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
					<div
						className="absolute inset-0 bg-black/50 backdrop-blur-sm"
						onClick={() => setIsMobileFilterOpen(false)}
					/>
					<div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl p-6 overflow-y-auto">
						<div className="flex items-center justify-between mb-6">
							<h2 className="font-bold text-xl">Bộ lọc</h2>
							<button
								onClick={() => setIsMobileFilterOpen(false)}
								className="p-2 rounded-full hover:bg-gray-100">
								<X className="w-6 h-6" />
							</button>
						</div>
						<div className="space-y-6">
							<SidebarContent />
							<button
								onClick={() => setIsMobileFilterOpen(false)}
								className="w-full py-3 bg-purple-600 text-white font-bold rounded-xl shadow-lg">
								Xem kết quả
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
