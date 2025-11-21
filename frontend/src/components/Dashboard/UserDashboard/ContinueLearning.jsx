import CourseCard from "@/components/Courses/CourseCard";
import DashboardSection from "../DashboardSection";

export default function ContinueLearning({ courses }) {
	return (
		<DashboardSection title="Continue Learning">
			<div className="flex gap-6 p-1 pb-4 snap-x scroll-container">
				{courses?.length > 0 ? (
					courses.map((course) => (
						<div
							key={course.id}
							className="w-[300px] flex-shrink-0 snap-start">
							<CourseCard course={course} />
						</div>
					))
				) : (
					<p className="text-gray-500">
						You are not enrolled in any courses yet.
					</p>
				)}
			</div>
		</DashboardSection>
	);
}
