import React from "react";
import NavButton from "@/components/NavButton";
import { Edit, Loader2, Play } from "lucide-react";
import { toast } from "react-hot-toast";

export default function CourseHeader({
	course,
	isEnrolled,
	isBusy,
	user,
	createCheckout,
}) {
	return (
		<>
			{/* Header */}
			<h1 className="text-3xl font-bold text-gray-900 mb-4">
				{course.name}
			</h1>
			<p className="text-lg text-gray-800 mb-8">
				{course.description || "No description provided."}
			</p>

			{/* Action Buttons */}
			<div className="flex items-center gap-4">
				{/* Check if user is enrolled */}
				{isEnrolled ? (
					<NavButton
						to={`/courses/${course.id}/learn`}
						className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700">
						<Play className="w-4 h-4" />
						Start Learning
					</NavButton>
				) : (
					<button
						onClick={() => {
							if (!user) {
								toast.error("Please log in to purchase.");
								return;
							}
							createCheckout();
						}}
						disabled={isBusy}
						className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md hover:bg-purple-700 disabled:bg-purple-400">
						{isBusy ? (
							<Loader2 className="w-4 h-4 animate-spin" />
						) : (
							"Buy Now"
						)}
					</button>
				)}

				{/* The "Edit Course" button remains */}
				{user.id === course.user.id && (
					<NavButton
						to={`/courses/${course.id}/edit`}
						className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
						<Edit className="w-4 h-4" />
						Edit Course
					</NavButton>
				)}
			</div>
		</>
	);
}
