import { useState } from "react";
import { FileText, List, Star } from "lucide-react";
import CourseDescription from "./CourseDescription";
import CourseCurriculumList from "./CourseCurriculumList";
import CourseReviews from "./CourseReviews";

export default function CourseTabs({ course, isEnrolled }) {
	const [activeTab, setActiveTab] = useState("overview");

	const tabs = [
		{ id: "overview", label: "Giới thiệu", icon: FileText },
		{ id: "curriculum", label: "Nội dung", icon: List },
		{ id: "reviews", label: "Đánh giá", icon: Star },
	];

	return (
		<div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
			{/* Tab Header */}
			<div className="flex border-b border-gray-100">
				{tabs.map((tab) => (
					<button
						key={tab.id}
						onClick={() => setActiveTab(tab.id)}
						className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold transition-all relative ${
							activeTab === tab.id
								? "text-purple-600 bg-purple-50/50"
								: "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
						}`}>
						<tab.icon className="w-4 h-4" />
						{tab.label}
						{activeTab === tab.id && (
							<div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />
						)}
					</button>
				))}
			</div>

			{/* Content Area */}
			<div>
				{activeTab === "overview" && (
					<div className="p-6 md:p-8">
						<CourseDescription description={course.description} />
					</div>
				)}

				{activeTab === "curriculum" && (
					<CourseCurriculumList
						modules={course.modules}
						isEnrolled={isEnrolled}
					/>
				)}

				{activeTab === "reviews" && (
					<CourseReviews course={course} isEnrolled={isEnrolled} />
				)}
			</div>
		</div>
	);
}
