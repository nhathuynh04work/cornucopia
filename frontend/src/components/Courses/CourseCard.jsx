import { Link, useLocation } from "react-router-dom";
import { Users } from "lucide-react";

export default function CourseCard({ course }) {
	const { pathname } = useLocation();
	const isAdmin = pathname.startsWith("/courses/admin");

	const coverImage =
		course.coverUrl ||
		`https://placehold.co/600x400/e2e8f0/64748b?text=${encodeURIComponent(
			course.name
		)}`;

	const enrollments = course._count?.enrollments || 0;
	const instructor = course.user;

	const statusStyle =
		{
			DRAFT: "text-yellow-700 bg-yellow-50 border-yellow-200",
			PUBLIC: "text-green-700 bg-green-50 border-green-200",
			UNLISTED: "text-gray-700 bg-gray-100 border-gray-200",
		}[course.status] || "text-gray-700 bg-gray-100 border-gray-200";

	return (
		<Link
			to={
				course.status === "DRAFT"
					? `/courses/${course.id}/edit`
					: `/courses/${course.id}`
			}
			className="group relative block rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden transition-all hover:shadow-md hover:border-purple-300 hover:translate-y-[-2px] focus:outline-none focus:ring-2 focus:ring-purple-500">
			{/* Cover image */}
			<div className="relative w-full h-40 overflow-hidden">
				<img
					src={coverImage}
					alt={course.name}
					className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
				/>

				{/* Status badge — only shown in admin section */}
				{isAdmin && course.status && (
					<span
						className={`absolute top-2 left-2 text-[10px] font-medium border rounded-full px-2 py-[1px] ${statusStyle}`}>
						{course.status.charAt(0) +
							course.status.slice(1).toLowerCase()}
					</span>
				)}
			</div>

			{/* Info */}
			<div className="p-4">
				<h2
					className="text-sm font-semibold text-gray-900 truncate group-hover:text-purple-600 transition-colors"
					title={course.name}>
					{course.name}
				</h2>

				<p
					className="text-xs text-gray-500 mt-1 truncate"
					title={instructor?.name || "N/A"}>
					{instructor?.name || "N/A"}
				</p>

				<div className="flex justify-between items-center mt-3 pt-2">
					<p className="text-xs font-semibold text-gray-900">
						${(course.price / 100).toFixed(2)}
					</p>
					<div className="flex items-center gap-1 text-gray-500">
						<Users className="w-3.5 h-3.5" />
						<span className="text-xs font-medium">
							{enrollments}
						</span>
					</div>
				</div>
			</div>

			{/* Accent bar */}
			<div className="absolute bottom-0 left-0 w-full h-[3px] bg-purple-100 rounded-b-xl group-hover:bg-purple-400 transition-colors"></div>
		</Link>
	);
}
