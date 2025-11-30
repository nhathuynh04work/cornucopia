import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
	BookOpen,
	Layers,
	FileQuestion,
	Settings,
	Clock,
	Loader2,
	Plus,
	MonitorPlay,
	FileText,
	Calendar,
	Trash2,
	Star,
	Eye,
} from "lucide-react";
import Avatar from "@/components/Shared/Avatar";
import StatusBadge from "@/components/Shared/StatusBadge";
import PaginationControl from "@/components/Shared/PaginationControl";
import toast from "react-hot-toast";

// --- HELPER: Generate Large Mock Data ---
const multiplyData = (baseItems, targetCount) => {
	const result = [];
	for (let i = 0; i < targetCount; i++) {
		const original = baseItems[i % baseItems.length];
		result.push({
			...original,
			id: `${original.id}-${i}`,
			title: `${original.title} ${i > 0 ? `(Copy ${i})` : ""}`,
			updatedAt: i % 3 === 0 ? "Hôm nay" : original.updatedAt,
		});
	}
	return result;
};

// --- BASE MOCK DATA ---
const BASE_COURSES = [
	{
		id: 1,
		title: "Complete React Developer in 2025 (w/ Redux, Hooks, GraphQL)",
		progress: 85,
		totalLessons: 120,
		completedLessons: 102,
		lastAccessed: "15 phút trước",
		coverUrl:
			"https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop",
	},
	{
		id: 2,
		title: "Luyện thi IELTS Speaking & Writing cấp tốc",
		progress: 30,
		totalLessons: 60,
		completedLessons: 18,
		lastAccessed: "1 ngày trước",
		coverUrl:
			"https://images.unsplash.com/photo-1543165796-5426273eaab3?q=80&w=2070&auto=format&fit=crop",
	},
];

const BASE_TESTS = [
	{
		id: 101,
		title: "Mock Test IELTS Listening #4 - Full Cam 18 (Ban 2024)",
		score: 7.5,
		totalScore: 9.0,
		date: "12/03/2025",
		status: "PASSED",
	},
	{
		id: 102,
		title: "React Hooks Deep Dive Quiz",
		score: 15,
		totalScore: 20,
		date: "10/03/2025",
		status: "FAILED",
	},
];

const BASE_DECKS = [
	{
		id: 201,
		title: "3000 từ vựng thông dụng (Oxford 3000)",
		mastered: 2100,
		total: 3000,
		lastStudied: "Hôm nay",
	},
	{
		id: 202,
		title: "Kanji N3 - Soumatome & Mimikara Oboeru",
		mastered: 50,
		total: 650,
		lastStudied: "2 ngày trước",
	},
];

const CREATOR_COURSES = [
	{
		id: 301,
		title: "Tiếng Anh giao tiếp cho người đi làm",
		students: 1200,
		rating: 4.8,
		status: "PUBLIC",
		updatedAt: "20/02/2025",
		coverUrl:
			"https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2074&auto=format&fit=crop",
	},
	{
		id: 302,
		title: "Master IELTS Writing Task 2",
		students: 450,
		rating: 4.9,
		status: "PUBLIC",
		updatedAt: "15/03/2025",
		coverUrl:
			"https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=2073&auto=format&fit=crop",
	},
];

const CREATOR_TESTS = [
	{
		id: 501,
		title: "Kiểm tra đầu vào (Placement Test)",
		attempts: 340,
		status: "PUBLIC",
		updatedAt: "12/02/2025",
	},
	{
		id: 502,
		title: "Mid-term Test Class A1 (Advanced)",
		attempts: 0,
		status: "DRAFT",
		updatedAt: "Hôm nay",
	},
];

const CREATOR_POSTS = [
	{
		id: 601,
		title: "Kinh nghiệm tự học ReactJS trong 3 tháng cho người mới bắt đầu",
		status: "PUBLIC",
		updatedAt: "01/03/2025",
		views: 1200,
		coverUrl:
			"https://images.unsplash.com/photo-1593720213428-28a5b9e94613?q=80&w=2070&auto=format&fit=crop",
	},
	{
		id: 602,
		title: "Tổng hợp tài liệu IELTS Reading 2025",
		status: "DRAFT",
		updatedAt: "Hôm nay",
		views: 0,
		coverUrl:
			"https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=2073&auto=format&fit=crop",
	},
];

const MOCK_SCENARIOS = {
	USER: {
		user: {
			name: "Nguyễn Văn A",
			email: "vana@example.com",
			avatarUrl: null,
			role: "USER",
			bio: "Đang học IELTS 7.0 và Frontend Development. Thích học qua Flashcard.",
			joinedAt: "Tháng 8, 2024",
			averageRating: null,
		},
		learning: {
			courses: multiplyData(BASE_COURSES, 12),
			recentTests: multiplyData(BASE_TESTS, 25),
			decks: multiplyData(BASE_DECKS, 8),
		},
		creations: {
			courses: [],
			tests: [],
			decks: multiplyData(BASE_DECKS, 15),
			posts: multiplyData(CREATOR_POSTS, 5),
		},
	},
	CREATOR: {
		user: {
			name: "Teacher Sarah",
			email: "sarah@cornucopia.edu",
			avatarUrl:
				"https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop",
			role: "CREATOR",
			bio: "Giảng viên Tiếng Anh với 10 năm kinh nghiệm. Chuyên luyện thi TOEIC/IELTS.",
			joinedAt: "Tháng 5, 2023",
			averageRating: 4.9,
		},
		learning: {
			courses: multiplyData(BASE_COURSES, 4),
			recentTests: [],
			decks: [],
		},
		creations: {
			courses: multiplyData(CREATOR_COURSES, 20),
			decks: multiplyData(BASE_DECKS, 12),
			tests: multiplyData(CREATOR_TESTS, 30),
			posts: multiplyData(CREATOR_POSTS, 50),
		},
	},
};

// --- HELPER COMPONENT: Delete Button Only ---
const DeleteAction = ({ onDelete, itemName }) => (
	<button
		onClick={(e) => {
			e.preventDefault();
			e.stopPropagation();
			onDelete();
		}}
		className="absolute top-3 right-3 p-2 rounded-xl bg-white/90 text-gray-400 hover:text-red-500 hover:bg-red-50 shadow-sm opacity-0 group-hover:opacity-100 transition-all z-20"
		title={`Xóa ${itemName}`}
	>
		<Trash2 className="w-4 h-4" />
	</button>
);

// --- COMPONENT: Paginated Section ---
const PaginatedSection = ({
	items,
	itemsPerPage = 6,
	renderItem,
	gridClass = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
	emptyMessage = "Không có dữ liệu.",
	emptyIcon: EmptyIcon = BookOpen,
}) => {
	const [page, setPage] = useState(1);
	const totalPages = Math.ceil(items.length / itemsPerPage);

	useEffect(() => setPage(1), [items.length]);

	if (items.length === 0) {
		return (
			<div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
				<div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-3">
					<EmptyIcon className="w-8 h-8" />
				</div>
				<p className="text-gray-500">{emptyMessage}</p>
			</div>
		);
	}

	const paginatedItems = items.slice(
		(page - 1) * itemsPerPage,
		page * itemsPerPage
	);

	return (
		<div>
			<div className={gridClass}>
				{paginatedItems.map((item) => renderItem(item))}
			</div>

			<PaginationControl
				currentPage={page}
				totalPages={totalPages}
				onPageChange={setPage}
			/>
		</div>
	);
};

// --- COMPONENTS ---

const TabButton = ({ active, onClick, icon: Icon, label }) => (
	<button
		onClick={onClick}
		className={`flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl transition-all ${
			active
				? "bg-purple-600 text-white shadow-lg shadow-purple-200"
				: "bg-white text-gray-600 hover:bg-gray-100"
		}`}
	>
		<Icon className="w-4 h-4" />
		{label}
	</button>
);

const SectionHeader = ({ title, action }) => (
	<div className="flex items-center justify-between mb-6 mt-10 first:mt-0">
		<h3 className="font-bold text-gray-900 text-xl">{title}</h3>
		{action}
	</div>
);

const ProgressBar = ({ percent }) => (
	<div className="w-full bg-gray-100 rounded-full h-2">
		<div
			className="bg-purple-600 h-2 rounded-full transition-all duration-500"
			style={{ width: `${percent}%` }}
		/>
	</div>
);

export default function UserLibrary() {
	const [activeTab, setActiveTab] = useState("learning");
	const [role, setRole] = useState("USER");
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(true);
		new Promise((resolve) => setTimeout(resolve, 600)).then(() => {
			setData(MOCK_SCENARIOS[role]);
			setLoading(false);
		});
	}, [role]);

	const handleDelete = (type, id) => {
		toast.success(`Đã xóa ${type} thành công`);
		setData((prev) => ({ ...prev }));
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50/50">
				<Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
			</div>
		);
	}

	const { user, learning, creations } = data;
	const isCreator = role === "CREATOR" || role === "ADMIN";

	return (
		<div className="min-h-screen bg-gray-50/50 pb-12 relative">
			{/* --- Temporary Role Switcher --- */}
			<div className="fixed bottom-6 right-6 z-50 bg-white p-2 rounded-xl shadow-xl border border-gray-200 flex flex-col gap-2">
				<div className="text-[10px] uppercase font-bold text-gray-400 px-2 text-center">
					Switch Role
				</div>
				<div className="flex gap-2">
					<button
						onClick={() => setRole("USER")}
						className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
							role === "USER"
								? "bg-purple-600 text-white shadow-lg shadow-purple-200"
								: "bg-gray-100 text-gray-600 hover:bg-gray-200"
						}`}
					>
						Học viên
					</button>
					<button
						onClick={() => setRole("CREATOR")}
						className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
							role === "CREATOR"
								? "bg-purple-600 text-white shadow-lg shadow-purple-200"
								: "bg-gray-100 text-gray-600 hover:bg-gray-200"
						}`}
					>
						Sáng tạo
					</button>
				</div>
			</div>

			{/* --- MAIN LAYOUT CONTAINER --- */}
			<div className="max-w-[1200px] mx-auto px-6 py-8">
				
				{/* --- PROFILE CARD --- */}
				<div className="bg-white rounded-3xl border border-gray-200 p-8 mb-8 shadow-sm">
					<div className="flex flex-col md:flex-row items-center md:items-start gap-6">
						<div className="relative shrink-0">
							<div className="w-24 h-24 rounded-full border-4 border-gray-50 shadow-sm overflow-hidden">
								<Avatar
									url={user.avatarUrl}
									name={user.name}
									className="w-full h-full text-2xl"
								/>
							</div>
						</div>
						<div className="flex-1 text-center md:text-left">
							<div className="flex flex-col md:flex-row items-center md:items-start gap-2 mb-2">
								<h1 className="text-2xl font-bold text-gray-900">
									{user.name}
								</h1>
								{role === "CREATOR" && (
									<StatusBadge
										status="CREATOR"
										label="Giảng viên"
										className="bg-blue-50 text-blue-600 border-blue-100 mt-1 md:mt-0"
									/>
								)}
							</div>
							<p className="text-gray-500 text-sm mb-4 max-w-2xl">
								{user.bio}
							</p>
							<div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-xs font-medium text-gray-500">
								<div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
									<Calendar className="w-3.5 h-3.5" />
									Tham gia {user.joinedAt}
								</div>
								{user.averageRating && (
									<div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg">
										<Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
										{user.averageRating} Đánh giá trung bình
									</div>
								)}
							</div>
						</div>
						<div className="shrink-0">
							<button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all">
								<Settings className="w-4 h-4" />
								Cài đặt
							</button>
						</div>
					</div>
				</div>

				{/* --- TABS (Separate from Profile Card) --- */}
				<div className="flex gap-4 mb-8">
					<TabButton
						active={activeTab === "learning"}
						onClick={() => setActiveTab("learning")}
						icon={BookOpen}
						label="Đang học"
					/>
					<TabButton
						active={activeTab === "creations"}
						onClick={() => setActiveTab("creations")}
						icon={Layers}
						label="Kho tài nguyên"
					/>
				</div>

				{/* --- TAB CONTENT --- */}
				{activeTab === "learning" && (
					<div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
						{/* Enrolled Courses */}
						<section>
							<SectionHeader
								title="Khóa học đang tham gia"
								action={
									<Link
										to="/courses"
										className="text-purple-600 text-sm font-bold hover:underline"
									>
										Tìm thêm
									</Link>
								}
							/>
							<PaginatedSection
								items={learning.courses}
								itemsPerPage={6}
								gridClass="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6"
								emptyIcon={BookOpen}
								emptyMessage="Bạn chưa tham gia khóa học nào."
								renderItem={(course) => (
									<Link
										to={`/courses/${course.id}/learn`}
										key={course.id}
										className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex gap-4 hover:shadow-md hover:border-purple-200 transition-all group relative"
									>
										<div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-gray-200 relative">
											<img
												src={course.coverUrl}
												alt=""
												className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
											/>
										</div>
										<div className="flex-1 flex flex-col justify-between py-1 min-w-0">
											<div>
												<h4
													className="font-bold text-gray-900 line-clamp-2 min-h-[3rem] group-hover:text-purple-700 transition-colors leading-tight"
													title={course.title}
												>
													{course.title}
												</h4>
												<p className="text-xs text-gray-500 mt-1">
													Đã học {course.completedLessons}/{course.totalLessons} bài
												</p>
											</div>
											<div>
												<div className="flex justify-between text-xs font-bold text-gray-600 mb-1.5">
													<span>{course.progress}%</span>
												</div>
												<ProgressBar percent={course.progress} />
												<div className="mt-3 flex items-center justify-between">
													<span className="text-[10px] text-gray-400 flex items-center gap-1">
														<Clock className="w-3 h-3" />
														{course.lastAccessed}
													</span>
												</div>
											</div>
										</div>
									</Link>
								)}
							/>
						</section>

						{/* Recent Tests - CLEANER LAYOUT */}
						<section>
							<SectionHeader title="Lịch sử làm bài thi" />
							<PaginatedSection
								items={learning.recentTests}
								itemsPerPage={6}
								gridClass="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
								emptyIcon={FileQuestion}
								emptyMessage="Chưa có lịch sử làm bài."
								renderItem={(test) => (
									<Link
										to={`/tests/${test.id}/result`}
										key={test.id}
										className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:border-purple-200 hover:shadow-md transition-all group flex flex-col"
									>
										<div className="flex justify-between items-start mb-3">
											<div className="w-10 h-10 rounded-lg bg-pink-50 text-pink-500 flex items-center justify-center">
												<FileQuestion className="w-5 h-5" />
											</div>
											<StatusBadge
												status={test.status}
												size="xs"
											/>
										</div>
										{/* Title with min-height to prevent jumping */}
										<h4
											className="font-bold text-gray-900 mb-2 group-hover:text-purple-700 transition-colors line-clamp-2 min-h-[3rem] leading-tight"
											title={test.title}
										>
											{test.title}
										</h4>
										<p className="text-xs text-gray-500 mb-4">
											Làm bài: {test.date}
										</p>
										<div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
											<div className="text-sm font-bold text-gray-900">
												<span className="text-gray-500 font-normal mr-1">
													Điểm:
												</span>
												{test.score}/{test.totalScore}
											</div>
											<div className="p-1.5 rounded-lg bg-gray-50 text-gray-400 group-hover:bg-purple-50 group-hover:text-purple-600 transition-colors">
												<Eye className="w-4 h-4" />
											</div>
										</div>
									</Link>
								)}
							/>
						</section>
					</div>
				)}

				{activeTab === "creations" && (
					<div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
						{/* --- My Courses (Creators Only) --- */}
						{isCreator && (
							<section>
								<SectionHeader
									title="Khóa học của tôi"
									action={
										<Link
											to="/courses/new"
											className="inline-flex items-center gap-1 text-sm font-bold text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg hover:bg-purple-100 transition-colors"
										>
											<Plus className="w-4 h-4" /> Tạo
											mới
										</Link>
									}
								/>
								<PaginatedSection
									items={creations.courses}
									itemsPerPage={6}
									gridClass="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
									emptyIcon={MonitorPlay}
									emptyMessage="Bạn chưa tạo khóa học nào."
									renderItem={(course) => (
										<Link
											to={`/courses/${course.id}/edit`}
											key={course.id}
											className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md hover:border-purple-200 transition-all group flex flex-col relative"
										>
											<div className="h-40 w-full bg-gray-100 relative overflow-hidden">
												<img
													src={course.coverUrl}
													alt=""
													className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
												/>
												<div className="absolute top-3 left-3">
													<StatusBadge
														status={course.status}
														size="xs"
														className="bg-white/90 backdrop-blur"
													/>
												</div>
												<DeleteAction 
													onDelete={() => handleDelete("khóa học", course.id)} 
													itemName="khóa học"
												/>
											</div>

											<div className="p-5 flex-1 flex flex-col">
												<h4
													className="font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3rem] group-hover:text-purple-700 transition-colors leading-tight"
													title={course.title}
												>
													{course.title}
												</h4>
												<div className="flex items-center gap-4 text-xs text-gray-500 mt-auto">
													<span>
														{course.students} học
														viên
													</span>
													<span className="flex items-center gap-1 text-amber-500 font-bold">
														<Star className="w-3 h-3 fill-amber-500" />
														{course.rating}
													</span>
												</div>
											</div>
										</Link>
									)}
								/>
							</section>
						)}

						{/* --- My Decks (All Users) --- */}
						<section>
							<SectionHeader
								title="Bộ thẻ Flashcard"
								action={
									<Link
										to="/decks/new"
										className="inline-flex items-center gap-1 text-sm font-bold text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg hover:bg-purple-100 transition-colors"
									>
										<Plus className="w-4 h-4" /> Tạo mới
									</Link>
								}
							/>
							<PaginatedSection
								items={creations.decks}
								itemsPerPage={6}
								gridClass="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
								emptyIcon={Layers}
								emptyMessage="Bạn chưa tạo bộ thẻ nào."
								renderItem={(deck) => (
									<Link
										to={`/decks/${deck.id}/edit`}
										key={deck.id}
										className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:border-purple-200 hover:shadow-md transition-all group flex flex-col relative"
									>
										<div className="flex justify-between items-start mb-3">
											<div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center">
												<Layers className="w-5 h-5" />
											</div>
											<StatusBadge
												status={deck.status}
												size="xs"
											/>
										</div>

										<DeleteAction 
											onDelete={() => handleDelete("bộ thẻ", deck.id)} 
											itemName="bộ thẻ"
										/>

										<h4
											className="font-bold text-gray-900 mb-1 group-hover:text-purple-700 transition-colors line-clamp-2 min-h-[3rem] leading-tight"
											title={deck.title}
										>
											{deck.title}
										</h4>
										<p className="text-xs text-gray-500 mt-auto">
											{deck.cards} thẻ • Cập nhật{" "}
											{deck.updatedAt}
										</p>
									</Link>
								)}
							/>
						</section>

						{/* --- My Posts (All Users) --- */}
						<section>
							<SectionHeader
								title="Bài viết"
								action={
									<Link
										to="/posts/new"
										className="inline-flex items-center gap-1 text-sm font-bold text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg hover:bg-purple-100 transition-colors"
									>
										<Plus className="w-4 h-4" /> Viết bài
									</Link>
								}
							/>
							<PaginatedSection
								items={creations.posts}
								itemsPerPage={6}
								gridClass="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
								emptyIcon={FileText}
								emptyMessage="Bạn chưa có bài viết nào."
								renderItem={(post) => (
									<Link
										to={`/posts/${post.id}/edit`}
										key={post.id}
										className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:border-purple-200 hover:shadow-md transition-all group flex flex-col relative"
									>
										{/* Post Image */}
										<div className="h-32 w-full bg-gray-100 relative overflow-hidden">
											{post.coverUrl ? (
												<img
													src={post.coverUrl}
													alt={post.title}
													className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
												/>
											) : (
												<div className="w-full h-full flex items-center justify-center bg-teal-50 text-teal-300">
													<FileText className="w-10 h-10" />
												</div>
											)}
											<div className="absolute top-2 left-2">
												<StatusBadge
													status={post.status}
													size="xs"
													className="bg-white/90 backdrop-blur"
												/>
											</div>
											<DeleteAction 
												onDelete={() => handleDelete("bài viết", post.id)} 
												itemName="bài viết"
											/>
										</div>

										<div className="p-4 flex-1 flex flex-col">
											<h4
												className="font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3rem] group-hover:text-purple-700 transition-colors leading-tight"
												title={post.title}
											>
												{post.title}
											</h4>
											<p className="text-xs text-gray-500 mt-auto">
												Cập nhật {post.updatedAt}
											</p>
										</div>
									</Link>
								)}
							/>
						</section>

						{/* --- My Tests (Creators Only) --- */}
						{isCreator && (
							<section>
								<SectionHeader
									title="Bài kiểm tra"
									action={
										<Link
											to="/tests/new"
											className="inline-flex items-center gap-1 text-sm font-bold text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg hover:bg-purple-100 transition-colors"
										>
											<Plus className="w-4 h-4" /> Tạo đề
											thi
										</Link>
									}
								/>
								<PaginatedSection
									items={creations.tests}
									itemsPerPage={6}
									gridClass="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
									emptyIcon={FileQuestion}
									emptyMessage="Bạn chưa tạo đề thi nào."
									renderItem={(test) => (
										<Link
											to={`/tests/${test.id}/edit`}
											key={test.id}
											className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:border-purple-200 hover:shadow-md transition-all group flex flex-col relative"
										>
											<div className="flex justify-between items-start mb-3">
												<div className="w-10 h-10 rounded-lg bg-pink-50 text-pink-500 flex items-center justify-center">
													<FileQuestion className="w-5 h-5" />
												</div>
												<StatusBadge
													status={test.status}
													size="xs"
												/>
											</div>

											<DeleteAction 
												onDelete={() => handleDelete("đề thi", test.id)} 
												itemName="đề thi"
											/>

											<h4
												className="font-bold text-gray-900 mb-1 group-hover:text-purple-700 transition-colors line-clamp-2 min-h-[3rem] leading-tight"
												title={test.title}
											>
												{test.title}
											</h4>
											<p className="text-xs text-gray-500 mt-auto">
												{test.attempts} lượt thi • Cập
												nhật {test.updatedAt}
											</p>
										</Link>
									)}
								/>
							</section>
						)}
					</div>
				)}
			</div>
		</div>
	);
}