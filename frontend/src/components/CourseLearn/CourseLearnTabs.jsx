import { useState } from "react";
import {
	Info,
	MessageSquare,
	Star,
	Send,
	BookOpen,
	Clock,
	Users,
} from "lucide-react";
import CourseReviews from "../CourseInfo/CourseReviews";

export default function CourseLearnTabs({
	course,
	allLessons,
	totalLessonsCount,
}) {
	const [activeTab, setActiveTab] = useState("overview");

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
									? "border-purple-600 text-purple-600"
									: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
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

				{/* REVIEWS TAB */}
				{activeTab === "reviews" && (
					<CourseReviews course={course} isEnrolled={true} />
				)}
			</div>
		</div>
	);
}
