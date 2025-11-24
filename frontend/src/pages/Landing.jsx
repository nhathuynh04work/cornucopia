import React from "react";
import { Link } from "react-router-dom";
import {
	BookOpen,
	ArrowRight,
	Layers,
	FileText,
	FileQuestion,
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
		<div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-purple-100 selection:text-purple-900">
			{/* --- Header --- */}
			<header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
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
							className="text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 px-5 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5">
							Bắt đầu miễn phí
						</Link>
					</div>
				</div>
			</header>

			{/* --- Minimal Hero Section --- */}
			<section className="pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
				<div className="max-w-4xl mx-auto text-center">
					<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wide mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
						<span className="relative flex h-2 w-2">
							<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
							<span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
						</span>
						Nền tảng học tập thế hệ mới
					</div>

					<h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-gray-900 mb-8 leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
						Khơi nguồn tri thức <br />
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">
							Không giới hạn.
						</span>
					</h1>

					<p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
						Cornucopia giúp bạn tạo, chia sẻ và nắm vững kiến thức
						thông qua các công cụ học tập thông minh như Flashcards,
						Bài kiểm tra và Khóa học trực tuyến.
					</p>

					<div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
						<Link
							to="/signup"
							className="w-full sm:w-auto px-8 py-4 bg-gray-900 hover:bg-black text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl">
							Tham gia ngay <ArrowRight className="w-5 h-5" />
						</Link>
						<Link
							to="/login"
							className="w-full sm:w-auto px-8 py-4 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold rounded-2xl transition-all flex items-center justify-center gap-2">
							<BookOpen className="w-5 h-5 text-gray-400" /> Khám
							phá khoá học
						</Link>
					</div>
				</div>
			</section>

			{/* --- Stats Section (Real Data) --- */}
			<section className="py-12 bg-white border-y border-gray-100">
				<div className="max-w-7xl mx-auto px-6">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
						<StatItem
							number={stats.totalStudents}
							label="Học viên"
							loading={isPending}
						/>
						<StatItem
							number={stats.totalCourses}
							label="Khóa học"
							loading={isPending}
						/>
						<StatItem
							number={stats.totalDecks}
							label="Flashcards"
							loading={isPending}
						/>
						<StatItem
							number={stats.totalTests}
							label="Bài thi"
							loading={isPending}
						/>
					</div>
				</div>
			</section>

			{/* --- DYNAMIC CONTENT SECTION --- */}
			<div className="bg-gray-50 py-24">
				{isError ? (
					<div className="text-center text-red-500 p-10">
						Không thể tải nội dung. Vui lòng thử lại sau.
					</div>
				) : (
					<div className="max-w-7xl mx-auto px-6 space-y-24">
						{/* 1. Featured Courses */}
						<ContentSection
							title="Khóa học nổi bật"
							description="Các khóa học được biên soạn kỹ lưỡng bởi cộng đồng chuyên gia."
							icon={BookOpen}
							color="text-blue-600"
							bg="bg-blue-100"
							link="/login"
							loading={isPending}
							empty={courses.length === 0}>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
								{courses.map((course) => (
									<CourseCard
										key={course.id}
										course={course}
									/>
								))}
							</div>
						</ContentSection>

						{/* 2. Popular Flashcards */}
						<ContentSection
							title="Bộ thẻ Flashcards"
							description="Rèn luyện từ vựng và trí nhớ với phương pháp lặp lại ngắt quãng."
							icon={Layers}
							color="text-purple-600"
							bg="bg-purple-100"
							link="/login"
							loading={isPending}
							empty={decks.length === 0}>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
								{decks.map((deck) => (
									<DeckCard key={deck.id} deck={deck} />
								))}
							</div>
						</ContentSection>

						{/* 3. Recent Tests */}
						<ContentSection
							title="Bài kiểm tra năng lực"
							description="Đánh giá trình độ hiện tại và theo dõi sự tiến bộ của bạn qua các bài kiểm tra chuẩn hóa."
							icon={FileQuestion}
							color="text-green-600"
							bg="bg-green-100"
							link="/login"
							loading={isPending}
							empty={tests.length === 0}>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
								{tests.map((test) => (
									<TestCard key={test.id} test={test} />
								))}
							</div>
						</ContentSection>

						{/* 4. Latest Posts */}
						<ContentSection
							title="Bài viết mới nhất"
							description="Chia sẻ kinh nghiệm, mẹo học tập và kiến thức văn hóa."
							icon={FileText}
							color="text-pink-600"
							bg="bg-pink-100"
							link="/login"
							loading={isPending}
							empty={posts.length === 0}>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
								{posts.map((post) => (
									<PostCard key={post.id} post={post} />
								))}
							</div>
						</ContentSection>
					</div>
				)}
			</div>

			{/* --- Footer --- */}
			<footer className="bg-white border-t border-gray-200 pt-16 pb-8">
				<div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
					<Logo className="mb-6 scale-110" />
					<p className="text-gray-500 text-sm max-w-md mb-8">
						Cornucopia là dự án mã nguồn mở giúp việc học ngôn ngữ
						trở nên dễ dàng, thú vị và hiệu quả hơn bao giờ hết.
					</p>
					<div className="flex gap-8 text-sm font-medium text-gray-600 mb-8">
						<Link
							to="/login"
							className="hover:text-purple-600 transition">
							Khóa học
						</Link>
						<Link
							to="/login"
							className="hover:text-purple-600 transition">
							Flashcards
						</Link>
						<Link
							to="/login"
							className="hover:text-purple-600 transition">
							Blog
						</Link>
						<Link
							to="/login"
							className="hover:text-purple-600 transition">
							Đăng nhập
						</Link>
					</div>
					<div className="text-xs text-gray-400">
						© {new Date().getFullYear()} Cornucopia Inc. All rights
						reserved.
					</div>
				</div>
			</footer>
		</div>
	);
}

function StatItem({ number, label, loading }) {
	if (loading) {
		return (
			<div className="space-y-2 flex flex-col items-center">
				<div className="h-8 w-24 bg-gray-100 rounded animate-pulse" />
				<div className="h-4 w-16 bg-gray-100 rounded animate-pulse" />
			</div>
		);
	}

	const formattedNumber = new Intl.NumberFormat("en-US", {
		notation: "compact",
		maximumFractionDigits: 1,
	}).format(number);

	return (
		<div className="space-y-1">
			<div className="text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
				{formattedNumber}+
			</div>
			<div className="text-sm font-medium text-gray-500 uppercase tracking-wide">
				{label}
			</div>
		</div>
	);
}

function ContentSection({
	title,
	description,
	icon: Icon,
	color,
	bg,
	link,
	children,
	loading,
	empty,
}) {
	return (
		<div className="space-y-8">
			<div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
				<div className="space-y-2">
					<div
						className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg ${bg} ${color} text-xs font-bold uppercase w-fit`}>
						<Icon className="w-4 h-4" /> {title}
					</div>
					<h2 className="text-3xl font-bold text-gray-900">
						{title}
					</h2>
					<p className="text-gray-500 max-w-xl">{description}</p>
				</div>
				<Link
					to={link}
					className="text-purple-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
					Xem tất cả <ArrowRight className="w-4 h-4" />
				</Link>
			</div>

			{loading ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
					{[1, 2, 3].map((i) => (
						<div
							key={i}
							className="h-80 bg-white rounded-2xl border border-gray-100 p-4 space-y-4 animate-pulse">
							<div className="h-40 bg-gray-100 rounded-xl w-full" />
							<div className="h-6 bg-gray-100 rounded w-3/4" />
							<div className="h-4 bg-gray-100 rounded w-1/2" />
						</div>
					))}
				</div>
			) : empty ? (
				<div className="h-40 w-full flex items-center justify-center bg-white rounded-3xl border border-dashed border-gray-200 text-gray-400 text-sm">
					Chưa có nội dung công khai nào.
				</div>
			) : (
				children
			)}
		</div>
	);
}
