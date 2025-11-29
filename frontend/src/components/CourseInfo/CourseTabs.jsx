import { useState } from "react";
import { FileText, List, Star } from "lucide-react";
import clsx from "clsx";
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
			{/* Sticky Tab Header */}
			<div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-6 pt-6">
				<div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
					{tabs.map((tab) => (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={clsx(
								"flex items-center gap-2 pb-3 border-b-2 text-sm font-bold transition-all whitespace-nowrap",
								activeTab === tab.id
									? "!border-purple-600 text-purple-700"
									: "!border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
							)}>
							<tab.icon className="w-4 h-4" />
							{tab.label}
						</button>
					))}
				</div>
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
