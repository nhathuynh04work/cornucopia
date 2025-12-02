import { Link } from "react-router-dom";
import {
	BookOpen,
	ArrowRight,
	Layers,
	FileText,
	FileQuestion,
	Sparkles,
	Trophy,
	Zap,
	Users,
} from "lucide-react";
import Logo from "@/components/Shared/Logo";

import { useGetLandingData } from "@/hooks/useUserQuery";
import CourseCard from "@/components/Courses/CourseCard";
import DeckCard from "@/components/Decks/DeckCard";
import PostCard from "@/components/Posts/PostCard";
import TestCard from "@/components/Tests/TestCard";

export default function Landing() {
	const { data, isPending, isError } = useGetLandingData();

	const courses = data?.courses || [];
	const decks = data?.decks || [];
	const posts = data?.posts || [];
	const tests = data?.tests || [];
	const stats = data?.stats || {
		totalStudents: 0,
		totalCourses: 0,
		totalDecks: 0,
		totalTests: 0,
	};

	return (
		<div className="min-h-screen bg-gray-50/50 font-sans text-gray-900">
			{/* --- Header --- */}
			<header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100/50 transition-all duration-300">
				<div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
					<Logo />
					<div className="flex items-center gap-4">
						<Link
							to="/login"
							className="text-sm font-bold text-gray-600 hover:text-purple-600 transition-colors px-4 py-2 hidden sm:block">
							Đăng nhập
						</Link>
						<Link
							to="/signup"
							className="text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-purple-200 hover:shadow-xl hover:-translate-y-0.5">
							Bắt đầu miễn phí
						</Link>
					</div>
				</div>
			</header>

			{/* --- Hero Section --- */}
			<section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
				{/* Abstract Background Blobs */}
				<div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl z-[-1] opacity-60 pointer-events-none">
					<div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
					<div className="absolute top-20 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
					<div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
				</div>

				<div className="max-w-4xl mx-auto text-center space-y-8">
					<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-purple-100 text-purple-700 text-sm font-bold shadow-sm hover:shadow-md transition-shadow cursor-default animate-in fade-in slide-in-from-bottom-4 duration-700">
						<Sparkles className="w-4 h-4 text-purple-500" />
						<span>Học tập thông minh hơn với AI</span>
					</div>

					<h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-gray-900 leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
						Chinh phục kiến thức <br />
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
							Theo cách của bạn.
						</span>
					</h1>

					<p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
						Nền tảng giáo dục toàn diện giúp bạn tạo lộ trình học
						tập, ôn luyện với Flashcards và kiểm tra năng lực mọi
						lúc, mọi nơi.
					</p>

					<div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
						<Link
							to="/signup"
							className="w-full sm:w-auto h-14 px-8 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-200 hover:-translate-y-1">
							Tham gia ngay
							<ArrowRight className="w-5 h-5" />
						</Link>
						<Link
							to="/courses"
							className="w-full sm:w-auto h-14 px-8 bg-white border border-gray-200 text-gray-700 hover:border-purple-200 hover:text-purple-600 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md">
							<BookOpen className="w-5 h-5" />
							Khám phá khoá học
						</Link>
					</div>
				</div>
			</section>

			{/* --- Stats Banner --- */}
			<section className="border-y border-gray-200 bg-white">
				<div className="max-w-7xl mx-auto px-6 py-12">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-8">
						<StatItem
							icon={Users}
							value={stats.totalStudents}
							label="Học viên"
							color="text-blue-600"
							bg="bg-blue-50"
						/>
						<StatItem
							icon={BookOpen}
							value={stats.totalCourses}
							label="Khóa học"
							color="text-purple-600"
							bg="bg-purple-50"
						/>
						<StatItem
							icon={Layers}
							value={stats.totalDecks}
							label="Flashcards"
							color="text-pink-600"
							bg="bg-pink-50"
						/>
						<StatItem
							icon={Trophy}
							value={stats.totalTests}
							label="Bài thi"
							color="text-yellow-600"
							bg="bg-yellow-50"
						/>
					</div>
				</div>
			</section>

			{/* --- Main Content Area --- */}
			<div className="py-24 space-y-32">
				{isError ? (
					<div className="text-center text-red-500 p-10 bg-red-50 rounded-xl max-w-md mx-auto">
						<p className="font-bold">Không thể tải nội dung</p>
						<p className="text-sm">
							Vui lòng kiểm tra kết nối mạng của bạn.
						</p>
					</div>
				) : (
					<div className="max-w-7xl mx-auto px-6 space-y-32">
						{/* --- Section 1: Courses --- */}
						<Section
							title="Khóa học nổi bật"
							subtitle="Được biên soạn bởi các chuyên gia hàng đầu"
							icon={BookOpen}
							accentColor="purple"
							link="/courses">
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								{isPending
									? [1, 2, 3, 4].map((i) => (
											<SkeletonCard key={i} />
									  ))
									: courses.map((course) => (
											<CourseCard
												key={course.id}
												course={course}
											/>
									  ))}
							</div>
						</Section>

						{/* --- Section 2: Decks --- */}
						<Section
							title="Bộ thẻ Flashcards"
							subtitle="Phương pháp lặp lại ngắt quãng (Spaced Repetition)"
							icon={Layers}
							accentColor="blue"
							link="/decks">
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								{isPending
									? [1, 2, 3, 4].map((i) => (
											<SkeletonCard key={i} />
									  ))
									: decks.map((deck) => (
											<DeckCard
												key={deck.id}
												deck={deck}
											/>
									  ))}
							</div>
						</Section>

						{/* --- Section 3: Tests --- */}
						<Section
							title="Bài kiểm tra năng lực"
							subtitle="Đánh giá trình độ và theo dõi sự tiến bộ"
							icon={FileQuestion}
							accentColor="green"
							link="/tests">
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								{isPending
									? [1, 2, 3, 4].map((i) => (
											<SkeletonCard key={i} />
									  ))
									: tests.map((test) => (
											<TestCard
												key={test.id}
												test={test}
											/>
									  ))}
							</div>
						</Section>

						{/* --- Section 4: Community Posts --- */}
						<Section
							title="Góc chia sẻ"
							subtitle="Bài viết và kinh nghiệm từ cộng đồng"
							icon={FileText}
							accentColor="pink"
							link="/posts">
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								{isPending
									? [1, 2, 3, 4].map((i) => (
											<SkeletonCard key={i} />
									  ))
									: posts.map((post) => (
											<PostCard
												key={post.id}
												post={post}
											/>
									  ))}
							</div>
						</Section>
					</div>
				)}
			</div>

			{/* --- CTA Section --- */}
			<section className="container mx-auto px-4 pb-24">
				<div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-100 rounded-[2.5rem] p-12 md:p-24 text-center relative overflow-hidden shadow-xl">
					{/* Decorative Elements */}
					<div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
					<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/40 rounded-full blur-[100px]" />

					<div className="relative z-10 max-w-3xl mx-auto space-y-8">
						<h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
							Sẵn sàng bắt đầu hành trình của bạn?
						</h2>
						<p className="text-gray-600 text-lg md:text-xl leading-relaxed">
							Tham gia cộng đồng học tập Cornucopia ngay hôm nay
							để tiếp cận hàng ngàn tài liệu học tập chất lượng
							cao.
						</p>
						<Link
							to="/signup"
							className="inline-flex h-14 px-10 items-center justify-center bg-purple-600 text-white rounded-2xl font-bold text-lg hover:bg-purple-700 hover:scale-105 transition-all shadow-lg hover:shadow-purple-200">
							Đăng ký miễn phí
						</Link>
					</div>
				</div>
			</section>

			{/* --- Footer --- */}
			<footer className="bg-white border-t border-gray-200 py-16">
				<div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
					<div className="flex flex-col items-center md:items-start gap-4">
						<Logo className="scale-110" />
						<p className="text-gray-500 text-sm max-w-xs text-center md:text-left">
							Nền tảng học tập mở cho mọi người. <br />©{" "}
							{new Date().getFullYear()} Cornucopia Inc.
						</p>
					</div>

					<div className="flex flex-wrap justify-center gap-8 text-sm font-medium text-gray-600">
						<Link
							to="/courses"
							className="hover:text-purple-600 transition">
							Khóa học
						</Link>
						<Link
							to="/decks"
							className="hover:text-purple-600 transition">
							Flashcards
						</Link>
						<Link
							to="/tests"
							className="hover:text-purple-600 transition">
							Bài thi
						</Link>
						<Link
							to="/posts"
							className="hover:text-purple-600 transition">
							Blog
						</Link>
					</div>
				</div>
			</footer>
		</div>
	);
}

// --- Subcomponents ---

function StatItem({ icon: Icon, value, label, color, bg }) {
	const formattedValue = new Intl.NumberFormat("en-US", {
		notation: "compact",
		maximumFractionDigits: 1,
	}).format(value || 0);

	return (
		<div className="flex flex-col items-center gap-3 p-4 rounded-2xl hover:bg-gray-50 transition-colors">
			<div className={`p-3 rounded-xl ${bg} ${color}`}>
				<Icon className="w-6 h-6" />
			</div>
			<div className="text-center">
				<div className="text-3xl font-extrabold text-gray-900">
					{formattedValue}+
				</div>
				<div className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1">
					{label}
				</div>
			</div>
		</div>
	);
}

function Section({ title, subtitle, icon: Icon, accentColor, link, children }) {
	const colorMap = {
		purple: "text-purple-600 bg-purple-100",
		blue: "text-blue-600 bg-blue-100",
		green: "text-green-600 bg-green-100",
		pink: "text-pink-600 bg-pink-100",
		yellow: "text-yellow-600 bg-yellow-100",
	};

	return (
		<div className="space-y-8">
			{/* Section Header */}
			<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-gray-100">
				<div className="space-y-2">
					<div className="flex items-center gap-2">
						<div
							className={`p-2 rounded-lg ${colorMap[accentColor]} w-fit`}>
							<Icon className="w-5 h-5" />
						</div>
						<h2 className="text-3xl font-bold text-gray-900 tracking-tight">
							{title}
						</h2>
					</div>
					<p className="text-gray-500 font-medium pl-1">{subtitle}</p>
				</div>
				<Link
					to={link}
					className="group flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-50 text-purple-700 font-bold hover:bg-purple-100 transition-all text-sm shrink-0">
					Xem tất cả
					<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
				</Link>
			</div>

			{/* Content Grid */}
			{children}
		</div>
	);
}

function SkeletonCard() {
	return (
		<div className="flex h-40 bg-white rounded-2xl border border-gray-100 p-4 animate-pulse">
			<div className="w-1/3 bg-gray-100 rounded-xl h-full mr-4" />
			<div className="flex-1 space-y-3 py-2">
				<div className="h-5 bg-gray-100 rounded w-3/4" />
				<div className="h-4 bg-gray-100 rounded w-1/2" />
				<div className="mt-auto pt-4 flex gap-2">
					<div className="h-6 w-16 bg-gray-100 rounded" />
					<div className="h-6 w-16 bg-gray-100 rounded" />
				</div>
			</div>
		</div>
	);
}
