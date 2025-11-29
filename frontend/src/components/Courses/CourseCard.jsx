import { Link } from "react-router-dom";
import { Users, BookOpen, Star, Globe, BarChart } from "lucide-react";
import Avatar from "@/components/Shared/Avatar";
import StatusBadge from "@/components/Shared/StatusBadge";
import { LEVEL_OPTIONS, LANGUAGE_OPTIONS } from "@/lib/constants/course";

function CourseCard({ course }) {
	const {
		id,
		title,
		coverUrl,
		price,
		user,
		_count,
		status,
		stats,
		level,
		language,
	} = course;

	const formattedPrice =
		price === 0
			? "Miễn phí"
			: new Intl.NumberFormat("vi-VN", {
					style: "currency",
					currency: "VND",
			  }).format(price);

	const isDraft = status === "DRAFT";
	const targetLink = isDraft ? `/courses/${id}/edit` : `/courses/${id}`;

	// Helper to get labels
	const levelLabel =
		LEVEL_OPTIONS.find((o) => o.value === level)?.label || level;
	const langLabel =
		LANGUAGE_OPTIONS.find((o) => o.value === language)?.label || language;

	return (
		<Link
			to={targetLink}
			className="group flex flex-col bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-purple-100 transition-all duration-300 h-full relative">
			{/* --- IMAGE SECTION --- */}
			<div className="aspect-video w-full overflow-hidden bg-gray-100 relative">
				{coverUrl ? (
					<img
						src={coverUrl}
						alt={title}
						className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
					/>
				) : (
					<div className="w-full h-full flex items-center justify-center bg-purple-50 text-purple-300">
						<BookOpen className="w-12 h-12" />
					</div>
				)}

				{/* Status Badge */}
				{status !== "PUBLIC" && (
					<div className="absolute top-3 left-3 z-10">
						<StatusBadge
							status={status}
							size="xs"
							className="shadow-sm !bg-white/90 backdrop-blur-md"
						/>
					</div>
				)}

				{/* Price Badge */}
				<div className="absolute top-3 right-3 px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-bold text-gray-900 rounded-full shadow-sm">
					{formattedPrice}
				</div>
			</div>

			{/* --- CONTENT SECTION --- */}
			<div className="p-5 flex-1 flex flex-col">
				{/* Title */}
				<h3 className="font-bold text-gray-900 text-lg line-clamp-2 mb-3 group-hover:text-purple-600 transition-colors">
					{title}
				</h3>

				{/* Metadata: Language & Level */}
				<div className="flex flex-wrap items-center gap-2 mb-3">
					<div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-md text-gray-600 text-[11px] font-medium border border-gray-100">
						<BarChart className="w-3 h-3 text-gray-400" />
						{levelLabel}
					</div>

					<div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-md text-gray-600 text-[11px] font-medium border border-gray-100">
						<Globe className="w-3 h-3 text-gray-400" />
						{langLabel}
					</div>
				</div>

				{/* Stats Row: Reviews */}
				<div className="flex items-center gap-1.5 mb-4">
					<Star className="w-4 h-4 fill-amber-400 text-amber-400" />
					<span className="text-sm font-bold text-gray-900">
						{stats?.rating || 0}
					</span>
					<span className="text-xs text-gray-500">
						({stats?.ratingCount || 0} đánh giá)
					</span>
				</div>

				{/* --- FOOTER --- */}
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