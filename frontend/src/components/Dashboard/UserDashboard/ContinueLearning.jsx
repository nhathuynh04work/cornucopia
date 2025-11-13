import React from "react";
import CourseProgressCard from "./CourseProgressCard";

export default function ContinueLearning({ courses, onResume }) {
	return (
		<section>
			<h2 className="text-xl font-semibold text-gray-700 mb-5">
				Continue Learning
			</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-1 pr-2">
				{courses?.length > 0 ? (
					courses.map((course) => (
						<CourseProgressCard
							key={course.id}
							course={course}
							onResume={onResume}
						/>
					))
				) : (
					<p className="text-gray-500 col-span-2">
						You are not enrolled in any courses yet.
					</p>
				)}
			</div>
		</section>
	);
}
