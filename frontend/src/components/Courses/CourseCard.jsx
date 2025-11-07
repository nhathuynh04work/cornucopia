import { Link } from "react-router";
import { Users } from "lucide-react";

export default function CourseCard({ course }) {
	const coverImage =
		course.coverUrl ||
		`https://placehold.co/600x400/e2e8f0/64748b?text=${encodeURIComponent(
			course.name
		)}`;

	const enrollments = course._count?.enrollments || 0;
	const instructor = course.user;

	return (
		<Link
			to={
				course.status === "DRAFT"
					? `/courses/${course.id}/edit`
					: `/courses/${course.id}`
			}
			className="block border border-gray-200 rounded-lg shadow-sm overflow-hidden transition-all hover:shadow-md hover:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500">
			<img
				src={coverImage}
				alt={course.name}
				className="w-full h-40 object-cover"
			/>
			<div className="p-3">
				<h2
					className="text-sm font-semibold text-gray-900 truncate"
					title={course.name}>
					{course.name}
				</h2>

				<p
					className="text-xs text-gray-500 mt-1 truncate"
					title={instructor?.name || "N/A"}>
					{instructor?.name || "N/A"}
				</p>

				<div className="flex justify-between items-center mt-2 pt-2">
					<p className="text-xs font-semibold">
						${(course.price / 100).toFixed(2)}
					</p>

					<div className="flex items-center gap-1 text-gray-500">
						<Users className="w-3 h-3" />
						<span className="text-xs font-medium">
							{enrollments}
						</span>
					</div>
				</div>
			</div>
		</Link>
	);
}
