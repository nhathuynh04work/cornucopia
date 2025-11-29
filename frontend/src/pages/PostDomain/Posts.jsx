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
	Clock,
} from "lucide-react";
import PostCard from "@/components/Posts/PostCard";
import PermissionGate from "@/components/Shared/PermissionGate";
import PageHeader from "@/components/Shared/PageHeader";
import RadixSelect from "@/components/Shared/RadixSelect";
import { PERMISSIONS } from "@/lib/constants";

// --- MOCK DATA ---
const ALL_TAGS = [
	"Technology", "AI", "Programming", "Career", "Language", "Tips", 
	"Review", "Life Skills", "Productivity", "Education", "Study Abroad",
	"Marketing", "Design", "Business", "Health", "Psychology", "Science",
	"History", "Culture", "Travel", "Food", "Finance", "Investing",
	"Startups", "Remote Work", "Freelancing", "Writing", "Public Speaking",
	"Leadership", "Management", "Teamwork", "Communication", "Negotiation",
	"Sales", "Data Science", "Machine Learning", "Web Development", "Mobile Dev",
	"DevOps", "Cloud Computing", "Cybersecurity", "Blockchain", "IoT",
	"Game Dev", "UI/UX", "Product Management", "Agile", "Scrum"
];

const generateMockPosts = () => {
	const basePosts = [
		{
			title: "Lộ trình học Front-end cho người mới bắt đầu 2025",
			excerpt: "Hướng dẫn chi tiết từ HTML, CSS, JS đến ReactJS và NextJS. Cập nhật các công nghệ mới nhất cần học.",
			coverUrl: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?q=80&w=2070&auto=format&fit=crop",
			author: { name: "Nhat Huynh", avatarUrl: null },
			createdAt: new Date("2025-01-15").toISOString(),
			readTime: "10 phút đọc",
			readTimeMinutes: 10,
			views: 12500,
			tags: ["Programming", "Career", "Web Development"],
			status: "PUBLIC",
		},
		{
			title: "5 phương pháp ghi nhớ từ vựng tiếng Anh siêu tốc",
			excerpt: "Áp dụng Spaced Repetition (Lặp lại ngắt quãng) và Mnemonics để học 50 từ mỗi ngày.",
			coverUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=2073&auto=format&fit=crop",
			author: { name: "English Master", avatarUrl: null },
			createdAt: new Date("2025-02-10").toISOString(),
			readTime: "7 phút đọc",
			readTimeMinutes: 7,
			views: 8900,
			tags: ["Language", "Tips"],
			status: "PUBLIC",
		},
		{
			title: "Review sách 'Atomic Habits' - Thay đổi tí hon, hiệu quả bất ngờ",
			excerpt: "Tại sao những thói quen nhỏ lại tạo nên sự khác biệt lớn? Bài học rút ra từ cuốn sách bán chạy nhất.",
			coverUrl: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=2086&auto=format&fit=crop",
			author: { name: "Book Worm", avatarUrl: null },
			createdAt: new Date("2025-02-20").toISOString(),
			readTime: "12 phút đọc",
			readTimeMinutes: 12,
			views: 4500,
			tags: ["Review", "Life Skills", "Psychology"],
			status: "PUBLIC",
		},
		{
			title: "DeepSeek vs ChatGPT: AI nào hỗ trợ lập trình tốt hơn?",
			excerpt: "So sánh khả năng generate code, debug và giải thích thuật toán của hai mô hình ngôn ngữ lớn.",
			coverUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop",
			author: { name: "AI Insider", avatarUrl: null },
			createdAt: new Date("2025-02-25").toISOString(),
			readTime: "4 phút đọc",
			readTimeMinutes: 4,
			views: 22000,
			tags: ["Technology", "AI", "Data Science"],
			status: "PUBLIC",
		},
		{
			title: "Cách quản lý thời gian hiệu quả với Pomodoro",
			excerpt: "Kỹ thuật Pomodoro là gì? Làm sao để tập trung làm việc trong 25 phút mà không xao nhãng?",
			coverUrl: "https://images.unsplash.com/photo-1495539406979-bf61750d38ad?q=80&w=2070&auto=format&fit=crop",
			author: { name: "Productivity Hub", avatarUrl: null },
			createdAt: new Date("2025-01-05").toISOString(),
			readTime: "5 phút đọc",
			readTimeMinutes: 5,
			views: 6700,
			tags: ["Productivity", "Tips"],
			status: "PUBLIC",
		},
		{
			title: "Du học Nhật Bản: Những điều cần biết về học bổng MEXT",
			excerpt: "Kinh nghiệm săn học bổng chính phủ Nhật Bản toàn phần. Hồ sơ, phỏng vấn và cuộc sống tại Nhật.",
			coverUrl: "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?q=80&w=2070&auto=format&fit=crop",
			author: { name: "Sakura Chan", avatarUrl: null },
			createdAt: new Date("2024-12-20").toISOString(),
			readTime: "15 phút đọc",
			readTimeMinutes: 15,
			views: 3400,
			tags: ["Education", "Study Abroad", "Culture"],
			status: "PUBLIC",
		},
	];

	let data = [];
	for (let i = 0; i < 4; i++) {
		data = [
			...data,
			...basePosts.map((p, idx) => ({
				...p,
				id: i * 6 + idx + 1,
				title: `${p.title} ${i > 0 ? `(Part ${i + 1})` : ""}`,
				// Randomize reading time for better filtering demo
				readTimeMinutes: Math.floor(Math.random() * 20) + 3, 
				readTime: `${Math.floor(Math.random() * 20) + 3} phút đọc`,
				// Add some random extra tags
				tags: [...p.tags, ALL_TAGS[Math.floor(Math.random() * ALL_TAGS.length)]]
			})),
		];
	}
	return data;
};

const MOCK_POSTS = generateMockPosts();

// --- MOCK HOOK ---
function useMockPosts(filters, page = 1, limit = 6, sort) {
	const filteredData = useMemo(() => {
		let data = [...MOCK_POSTS];

		// 1. Text Search
		if (filters.search) {
			data = data.filter((item) =>
				item.title.toLowerCase().includes(filters.search.toLowerCase())
			);
		}

		// 2. Tag Filter (OR Logic: match any selected tag)
		if (filters.tags?.length > 0) {
			data = data.filter((item) => 
				item.tags.some(tag => filters.tags.includes(tag))
			);
		}

		// 3. Reading Time Filter
		if (filters.readingTime) {
			if (filters.readingTime === "short") { // < 5 mins
				data = data.filter(item => item.readTimeMinutes < 5);
			} else if (filters.readingTime === "medium") { // 5 - 10 mins
				data = data.filter(item => item.readTimeMinutes >= 5 && item.readTimeMinutes <= 10);
			} else if (filters.readingTime === "long") { // > 10 mins
				data = data.filter(item => item.readTimeMinutes > 10);
			}
		}

		// Sorting
		if (sort === "newest") {
			data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
		} else if (sort === "popular") {
			data.sort((a, b) => b.views - a.views);
		} else if (sort === "oldest") {
			data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
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

const RadioItem = ({ label, name, checked, onChange, icon }) => (
	<label className="flex items-center gap-3 cursor-pointer group select-none py-1 hover:bg-gray-50 rounded-lg px-1 -mx-1 transition-colors">
		<input
			type="radio"
			name={name}
			className="w-4 h-4 border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer accent-purple-600"
			checked={checked}
			onChange={onChange}
		/>
		<div className={`text-sm flex items-center gap-2 ${checked ? "text-gray-900 font-medium" : "text-gray-600"}`}>
			{icon}
			{label}
		</div>
	</label>
);

const SORT_OPTIONS = [
	{ value: "newest", label: "Mới nhất" },
	{ value: "popular", label: "Phổ biến nhất" },
	{ value: "oldest", label: "Cũ nhất" },
];

export default function Posts() {
	const navigate = useNavigate();
	const [search, setSearch] = useState("");
	const [selectedTags, setSelectedTags] = useState([]);
	const [readingTime, setReadingTime] = useState(null); // 'short', 'medium', 'long'
	const [sort, setSort] = useState("newest");
	
	// Tag Search State
	const [tagSearch, setTagSearch] = useState("");

	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);

	const filters = useMemo(
		() => ({
			search,
			tags: selectedTags,
			readingTime,
		}),
		[search, selectedTags, readingTime]
	);

	const { data: posts, pagination } = useMockPosts(filters, currentPage, 6, sort);

	const toggleFilter = (setter, value) => {
		setter((prev) =>
			prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
		);
		setCurrentPage(1);
	};

	const clearAllFilters = () => {
		setSearch("");
		setSelectedTags([]);
		setReadingTime(null);
		setCurrentPage(1);
	};

	const handleCreatePost = () => {
		navigate("/posts/new");
	};

	// --- LOGIC FOR FILTERING TAGS IN THE SIDEBAR ---
	const filteredTagsDisplay = ALL_TAGS.filter(tag => 
		tag.toLowerCase().includes(tagSearch.toLowerCase())
	);

	const SidebarContent = () => (
		<div className="flex flex-col">
			<div className="flex items-center justify-between mb-4">
				<h2 className="font-bold text-lg flex items-center gap-2 text-gray-900">
					<SlidersHorizontal className="w-5 h-5 text-purple-600" />
					Bộ lọc
				</h2>
				{(selectedTags.length > 0 || readingTime) && (
					<button
						onClick={clearAllFilters}
						className="text-xs font-semibold text-purple-600 hover:text-purple-700 hover:underline"
					>
						Xóa tất cả
					</button>
				)}
			</div>

			<div>
				{/* Reading Time */}
				<FilterSection title="Thời gian đọc">
					<RadioItem
						name="readingTime"
						label="Tất cả"
						checked={readingTime === null}
						onChange={() => setReadingTime(null)}
					/>
					<RadioItem
						name="readingTime"
						label="Dưới 5 phút"
						checked={readingTime === "short"}
						onChange={() => setReadingTime("short")}
						icon={<Clock className="w-3.5 h-3.5 text-gray-400" />}
					/>
					<RadioItem
						name="readingTime"
						label="5 - 10 phút"
						checked={readingTime === "medium"}
						onChange={() => setReadingTime("medium")}
						icon={<Clock className="w-3.5 h-3.5 text-gray-400" />}
					/>
					<RadioItem
						name="readingTime"
						label="Trên 10 phút"
						checked={readingTime === "long"}
						onChange={() => setReadingTime("long")}
						icon={<Clock className="w-3.5 h-3.5 text-gray-400" />}
					/>
				</FilterSection>

				{/* Topics / Tags - Scalable UI */}
				<FilterSection title="Chủ đề">
					{/* Local Search Input for Tags */}
					<div className="relative mb-2">
						<input
							type="text"
							placeholder="Tìm chủ đề..."
							value={tagSearch}
							onChange={(e) => setTagSearch(e.target.value)}
							className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none bg-gray-50"
						/>
						<Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
					</div>

					{/* Scrollable Container for Many Tags */}
					<div className="max-h-[240px] overflow-y-auto pr-1 scroll-container">
						{filteredTagsDisplay.length > 0 ? (
							filteredTagsDisplay.map(tag => (
								<CheckboxItem
									key={tag}
									label={tag}
									checked={selectedTags.includes(tag)}
									onChange={() => toggleFilter(setSelectedTags, tag)}
									// In a real app, count would come from aggregation
									count={Math.floor(Math.random() * 50)} 
								/>
							))
						) : (
							<div className="text-xs text-gray-400 py-2 text-center">
								Không tìm thấy chủ đề
							</div>
						)}
					</div>
				</FilterSection>
			</div>
		</div>
	);

	return (
		<div className="min-h-screen bg-gray-50/50">
			<div className="px-6 pt-6 max-w-[1600px] mx-auto">
				<PageHeader
					title="Bài viết & Chia sẻ"
					description="Cập nhật kiến thức, kinh nghiệm và mẹo học tập hữu ích từ cộng đồng."
					action={
						<PermissionGate allowedRoles={PERMISSIONS.CREATE_POST}>
							<button
								onClick={handleCreatePost}
								className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl transition-colors shadow-sm hover:shadow"
							>
								<Plus className="w-4 h-4" />
								Viết bài mới
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
							<span className="font-bold text-gray-900">{pagination.totalItems}</span> bài viết
						</span>

						<div className="relative flex-1 max-w-md group">
							<input
								type="text"
								placeholder="Tìm kiếm bài viết..."
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
						{posts.length > 0 ? (
							<>
								<div className="grid grid-cols-1 gap-4">
									{posts.map((post) => (
										<div key={post.id}>
											<PostCard post={post} />
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