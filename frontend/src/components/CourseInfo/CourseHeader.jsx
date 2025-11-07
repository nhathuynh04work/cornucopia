import React from "react";
import NavButton from "@/components/NavButton";
import { Edit } from "lucide-react";

export default function CourseHeader({ course }) {
	return (
		<>
			{/* Header */}
			<h1 className="text-3xl font-bold text-gray-900 mb-4">
				{course.name}
			</h1>
			<p className="text-lg text-gray-800 mb-8">
				{course.description || "No description provided."}
			</p>
		</>
	);
}
