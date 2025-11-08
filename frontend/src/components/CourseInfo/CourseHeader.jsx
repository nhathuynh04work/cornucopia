import React from "react";
import { Edit } from "lucide-react";
import NavButton from "@/components/NavButton";

export default function CourseHeader({ course }) {
	return (
		<div className="border-b border-gray-200 pb-6 mb-8">
			<div className="flex justify-between items-start gap-4">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">
						{course.name}
					</h1>
					<p className="text-base text-gray-600 mt-2 max-w-3xl">
						{course.description || "No description provided."}
					</p>
				</div>

				{course.status === "DRAFT" && (
					<span className="text-xs font-semibold text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-full px-3 py-1">
						Draft
					</span>
				)}
			</div>
		</div>
	);
}
