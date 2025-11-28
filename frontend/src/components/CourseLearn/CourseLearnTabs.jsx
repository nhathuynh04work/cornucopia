import { useState, useMemo } from "react";
import {
	Info,
	MessageSquare,
	Star,
	Send,
	BookOpen,
	Clock,
	Users,
	Filter,
} from "lucide-react";
import RadixSelect from "../Shared/RadixSelect.jsx";

// MOCK DATA
const MOCK_STATS = {
	rating: 4.8,
	ratingCount: 320,
	ratingDist: [
		{ stars: 5, count: 250, percent: 78 },
		{ stars: 4, count: 50, percent: 15 },
		{ stars: 3, count: 15, percent: 5 },
		{ stars: 2, count: 3, percent: 1 },
		{ stars: 1, count: 2, percent: 1 },
	],
};

const MOCK_REVIEWS = [
	{
		id: 1,
		user: "Nguyễn Văn A",
		avatar: "A",
		rating: 5,
		date: "2023-10-15",
		content: "Khóa học rất tuyệt vời, giảng viên dạy dễ hiểu.",
	},
	{
		id: 2,
		user: "Trần Thị B",
		avatar: "B",
		rating: 4,
		date: "2023-11-20",
		content: "Nội dung tốt nhưng phần Redux hơi khó hiểu một chút.",
	},
	{
		id: 3,
		user: "Lê Văn C",
		avatar: "C",
		rating: 5,
		date: "2023-09-05",
		content:
			"Đáng đồng tiền bát gạo! Đã làm được project thực tế sau khóa học.",
	},
	{
		id: 4,
		user: "Phạm Thị D",
		avatar: "D",
		rating: 3,
		date: "2023-08-12",
		content: "Cần cập nhật thêm về React Router v6 mới nhất.",
	},
	{
		id: 5,
		user: "Hoàng Văn E",
		avatar: "E",
		rating: 5,
		date: "2023-12-01",
		content: "Support nhiệt tình, 10 điểm.",
	},
];

const SORT_OPTIONS_REVIEWS = [
	{ label: "Mới nhất", value: "newest" },
	{ label: "Cũ nhất", value: "oldest" },
];

const SORT_OPTIONS_COMMENTS = [
	{ label: "Mới nhất", value: "newest" },
	{ label: "Cũ nhất", value: "oldest" },
];

export default function CourseLearnTabs({
	course,
	allLessons,
	totalLessonsCount,
}) {
	const [activeTab, setActiveTab] = useState("overview");
	const [reviewSort, setReviewSort] = useState("newest");
	const [starFilter, setStarFilter] = useState("all");

	// Filter Reviews
	const filteredReviews = useMemo(() => {
		let result = [...MOCK_REVIEWS];
		if (starFilter !== "all") {
			result = result.filter((r) => r.rating === parseInt(starFilter));
		}
		result.sort((a, b) => {
			if (reviewSort === "newest")
				return new Date(b.date) - new Date(a.date);
			if (reviewSort === "oldest")
				return new Date(a.date) - new Date(b.date);
			return 0;
		});
		return result;
	}, [reviewSort, starFilter]);

	return (
		<div className="w-full pt-6">
			{/* NAVIGATION */}
			<div className="border-b border-gray-200 mb-6 px-4 md:px-8">
				<div className="flex items-center gap-8 max-w-7xl mx-auto">
					{[
						{
							id: "overview",
							icon: Info,
							label: "Thông tin khóa học",
						},
						{
							id: "comments",
							icon: MessageSquare,
							label: "Hỏi đáp",
						},
						{ id: "reviews", icon: Star, label: "Đánh giá" },
					].map((tab) => (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={`pb-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
								activeTab === tab.id
									? "!border-purple-600 text-purple-600"
									: "!border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
							}`}>
							<tab.icon className="w-4 h-4" />
							{tab.label}
						</button>
					))}
				</div>
			</div>

			{/* TAB CONTENT */}
			<div className="min-h-[300px] animate-in fade-in slide-in-from-bottom-2 duration-300 pb-20 max-w-7xl mx-auto px-4 md:px-8">
				{/* OVERVIEW TAB */}
				{activeTab === "overview" && (
					<div className="max-w-3xl mx-auto space-y-8">
						<div className="space-y-4">
							<p className="text-xl text-gray-600 leading-relaxed font-medium">
								{course.excerpt}
							</p>

							<div className="flex flex-wrap gap-6 text-sm text-gray-600 border-y border-gray-100 py-4">
								<div className="flex items-center gap-2">
									<BookOpen className="w-4 h-4 text-gray-400" />
									<span>{totalLessonsCount} bài học</span>
								</div>
								<div className="flex items-center gap-2">
									<Clock className="w-4 h-4 text-gray-400" />
									<span>
										{allLessons.reduce(
											(acc, l) => acc + (l.duration || 0),
											0
										)}{" "}
										phút
									</span>
								</div>
								<div className="flex items-center gap-2">
									<Users className="w-4 h-4 text-gray-400" />
									<span>
										{course.enrollments?.length || 0} học
										viên
									</span>
								</div>
							</div>
						</div>

						<div>
							<h3 className="font-bold text-gray-900 text-lg mb-3">
								Giới thiệu khóa học
							</h3>
							<div
								className="prose prose-gray max-w-none prose-a:text-purple-600"
								dangerouslySetInnerHTML={{
									__html: course.description,
								}}
							/>
						</div>
					</div>
				)}

				{/* COMMENTS TAB (Mock) */}
				{activeTab === "comments" && (
					<div className="max-w-3xl mx-auto">
						<div className="flex gap-4 mb-8">
							<div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold shrink-0">
								ME
							</div>
							<div className="flex-1">
								<textarea
									placeholder="Bạn có thắc mắc gì về bài học này?"
									className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 min-h-[100px] resize-none"
								/>
								<div className="flex justify-end mt-2">
									<button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 flex items-center gap-2">
										<Send className="w-3.5 h-3.5" />
										Gửi câu hỏi
									</button>
								</div>
							</div>
						</div>
						<div className="text-center text-gray-500 italic">
							Tính năng bình luận đang được phát triển.
						</div>
					</div>
				)}

				{/* REVIEWS TAB (Mock) */}
				{activeTab === "reviews" && (
					<div className="max-w-3xl mx-auto space-y-10">
						{/* Summary */}
						<div className="grid grid-cols-1 md:grid-cols-12 gap-8 border-b border-gray-100 pb-10">
							<div className="md:col-span-4 flex flex-col items-center justify-center text-center">
								<div className="text-6xl font-bold text-gray-900 mb-3">
									{MOCK_STATS.rating}
								</div>
								<div className="flex gap-1.5 mb-2">
									{[1, 2, 3, 4, 5].map((star) => (
										<Star
											key={star}
											className={`w-6 h-6 ${
												star <=
												Math.round(MOCK_STATS.rating)
													? "text-purple-500 fill-purple-500"
													: "text-gray-200 fill-gray-200"
											}`}
										/>
									))}
								</div>
								<div className="text-sm text-gray-500 font-medium">
									{MOCK_STATS.ratingCount} đánh giá
								</div>
							</div>
							<div className="md:col-span-8 space-y-2.5 pt-2">
								{MOCK_STATS.ratingDist.map((item) => (
									<div
										key={item.stars}
										className="flex items-center gap-3 text-sm">
										<div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
											<div
												className="h-full bg-purple-500 rounded-full"
												style={{
													width: `${item.percent}%`,
												}}
											/>
										</div>
										<div className="flex items-center gap-1 w-12 shrink-0 justify-end">
											<div className="font-bold text-gray-700">
												{item.stars}
											</div>
											<Star className="w-3.5 h-3.5 text-purple-500 fill-purple-500" />
										</div>
										<div className="w-10 text-right text-gray-500 text-xs tabular-nums">
											{item.percent}%
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Filters & List */}
						<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
							<div className="flex flex-wrap gap-2">
								<button
									onClick={() => setStarFilter("all")}
									className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
										starFilter === "all"
											? "bg-purple-600 text-white"
											: "bg-gray-100 text-gray-700 hover:bg-gray-200"
									}`}>
									<Filter className="w-3.5 h-3.5" />
									Tất cả
								</button>
								{[5, 4, 3, 2, 1].map((star) => (
									<button
										key={star}
										onClick={() =>
											setStarFilter(star.toString())
										}
										className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
											starFilter === star.toString()
												? "bg-purple-600 text-white"
												: "bg-gray-100 text-gray-700 hover:bg-gray-200"
										}`}>
										{star} sao
									</button>
								))}
							</div>
							<RadixSelect
								value={reviewSort}
								onValueChange={setReviewSort}
								options={SORT_OPTIONS_REVIEWS}
								className="w-[160px]"
							/>
						</div>

						<div className="space-y-6">
							{filteredReviews.map((review) => (
								<div
									key={review.id}
									className="flex gap-4 p-6 rounded-2xl bg-gray-50/50 border border-gray-100">
									<div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold shrink-0">
										{review.avatar}
									</div>
									<div className="flex-1 space-y-2">
										<div className="flex items-center justify-between">
											<span className="font-bold text-gray-900 text-sm">
												{review.user}
											</span>
											<span className="text-xs text-gray-400">
												{review.date}
											</span>
										</div>
										<div className="flex gap-0.5">
											{[...Array(5)].map((_, i) => (
												<Star
													key={i}
													className={`w-3.5 h-3.5 ${
														i < review.rating
															? "text-purple-500 fill-purple-500"
															: "text-gray-200 fill-gray-200"
													}`}
												/>
											))}
										</div>
										<p className="text-gray-600 text-sm leading-relaxed">
											{review.content}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
