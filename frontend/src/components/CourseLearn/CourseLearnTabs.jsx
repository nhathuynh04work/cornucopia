import { useState } from "react";
import { Info, MessageSquare, Star } from "lucide-react";
import CourseReviews from "../CourseInfo/CourseReviews";
import CommentSection from "../Comments/CommentSection";
import CourseOverview from "./CourseOverview";

export default function CourseLearnTabs({
	course,
	allLessons,
	totalLessonsCount,
	currentLessonId,
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
			<div className="min-h-[300px] pb-20 max-w-7xl mx-auto px-4 md:px-8">
				{/* OVERVIEW TAB */}
				{activeTab === "overview" && (
					<CourseOverview
						course={course}
						allLessons={allLessons}
						totalLessonsCount={totalLessonsCount}
					/>
				)}

				{/* COMMENTS TAB*/}
				{activeTab === "comments" && (
					<CommentSection lessonId={currentLessonId} />
				)}

				{/* REVIEWS TAB */}
				{activeTab === "reviews" && (
					<CourseReviews course={course} isEnrolled={true} />
				)}
			</div>
		</div>
	);
}
