import { Link } from "react-router-dom";
import { Users, BookOpen } from "lucide-react";
import Avatar from "@/components/Shared/Avatar";
import StatusBadge from "@/components/Shared/StatusBadge";

function CourseCard({ course }) {
	const { id, name, description, coverUrl, price, user, _count, status } =
		course;

	const formattedPrice =
		price === 0
			? "Miễn phí"
			: new Intl.NumberFormat("vi-VN", {
					style: "currency",
					currency: "VND",
			  }).format(price);

	const isDraft = status === "DRAFT";
	const targetLink = isDraft ? `/courses/${id}/edit` : `/courses/${id}`;

	return (
		<Link
			to={targetLink}
			className="group flex flex-col bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-purple-100 transition-all duration-300 h-full relative">
			{/* Status Badge Overlay for Non-Public courses */}
			{status !== "PUBLIC" && (
				<div className="absolute top-3 left-3 z-10">
					<StatusBadge
						status={status}
						size="xs"
						className="shadow-sm !bg-white/90 backdrop-blur-md"
					/>
				</div>
			)}

			{/* Cover Image */}
			<div className="aspect-video w-full overflow-hidden bg-gray-100 relative">
				{coverUrl ? (
					<img
						src={coverUrl}
						alt={name}
						className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
					/>
				) : (
					<div className="w-full h-full flex items-center justify-center bg-purple-50 text-purple-300">
						<BookOpen className="w-12 h-12" />
					</div>
				)}

				{/* Price Badge */}
				<div className="absolute top-3 right-3 px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-bold text-gray-900 rounded-full shadow-sm">
					{formattedPrice}
				</div>
			</div>

			{/* Content */}
			<div className="p-5 flex-1 flex flex-col">
				<h3 className="font-bold text-gray-900 text-lg line-clamp-2 mb-2 group-hover:text-purple-600 transition-colors">
					{name}
				</h3>

				<p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
					{description || "Chưa có mô tả cho khóa học này."}
				</p>

				{/* Footer Info */}
				<div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
					{/* Author */}
					<div className="flex items-center gap-2">
						<Avatar
							url={user?.avatarUrl}
							name={user?.name}
							size="xs"
						/>
						<span className="text-xs font-medium text-gray-600 truncate max-w-[100px]">
							{user?.name}
						</span>
					</div>

					{/* Enrollment Count */}
					<div className="flex items-center gap-1 text-xs text-gray-400">
						<Users className="w-3.5 h-3.5" />
						<span>{_count?.enrollments || 0} học viên</span>
					</div>
				</div>
			</div>
		</Link>
	);
}

export default CourseCard;
