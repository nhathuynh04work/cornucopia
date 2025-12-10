import { Link } from "react-router-dom";
import {
	Users,
	BookOpen,
	BarChart2,
	Globe,
	Clock,
	PlayCircle,
} from "lucide-react";
import Avatar from "@/components/Shared/Avatar";
import StarRating from "@/components/Shared/StarRating";
import Badge from "@/components/Shared/Badge";
import { LEVEL_OPTIONS, LANGUAGE_OPTIONS } from "@/lib/constants/common";

const formatDuration = (seconds) => {
	if (!seconds) return "0h";
	const hours = Math.floor(seconds / 3600);
	const minutes = Math.floor((seconds % 3600) / 60);
	if (hours > 0) {
		return `${hours}h ${minutes > 0 ? `${minutes}p` : ""}`;
	}
	return `${minutes}p`;
};

const getStatusBadge = (status) => {
	switch (status) {
		case "DRAFT":
			return { variant: "warning", label: "Bản nháp" };
		case "PRIVATE":
			return { variant: "secondary", label: "Riêng tư" };
		case "ARCHIVED":
			return { variant: "default", label: "Lưu trữ" };
		default:
			return { variant: "default", label: status };
	}
};

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
		duration,
		lessons,
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

	const levelLabel =
		LEVEL_OPTIONS.find((o) => o.value === level)?.label || level;
	const langLabel =
		LANGUAGE_OPTIONS.find((o) => o.value === language)?.label || language;

	const rating = stats?.rating || 0;
	const ratingCount = stats?.ratingCount || 0;

	const statusConfig = getStatusBadge(status);

	return (
		<Link
			to={targetLink}
			className="group flex flex-col md:flex-row bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-purple-200 transition-all duration-300 h-full md:h-60 relative">
			{/* --- IMAGE SECTION (Left Side) --- */}
			<div className="w-full aspect-video md:w-72 shrink-0 relative overflow-hidden bg-gray-100 md:h-full">
				{status !== "PUBLIC" && (
					<div className="absolute top-2 left-2 z-10">
						<Badge variant={statusConfig.variant}>
							{statusConfig.label}
						</Badge>
					</div>
				)}
				{coverUrl ? (
					<img
						src={coverUrl}
						alt={title}
						className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
					/>
				) : (
					<div className="w-full h-full flex items-center justify-center bg-purple-50 text-purple-300">
						<BookOpen className="w-12 h-12" />
					</div>
				)}
			</div>

			{/* --- CONTENT SECTION (Right Side) --- */}
			<div className="flex-1 p-5 flex flex-col min-w-0 overflow-hidden">
				{/* Header: Title & Price */}
				<div className="flex justify-between items-start gap-4 mb-2">
					<div className="space-y-1.5">
						{/* Metadata Badges */}
						<div className="flex flex-wrap items-center gap-2 text-[10px] font-bold tracking-wider uppercase text-gray-500">
							<div className="flex items-center gap-1 text-purple-600">
								<Globe className="w-3 h-3" />
								{langLabel}
							</div>
							<span className="w-0.5 h-3 bg-gray-200"></span>
							<div className="flex items-center gap-1 text-blue-600">
								<BarChart2 className="w-3 h-3" />
								{levelLabel}
							</div>
						</div>

						<h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-purple-700 transition-colors line-clamp-2">
							{title}
						</h3>
					</div>

					<div className="shrink-0 font-bold text-purple-700 bg-purple-50 px-3 py-1.5 rounded-lg text-sm">
						{formattedPrice}
					</div>
				</div>

				{/* 1. Rating Row */}
				<div className="flex items-center gap-2 mb-2">
					<StarRating rating={rating} size={16} />

					<div className="flex items-baseline gap-1">
						<span className="text-sm font-bold text-gray-900">
							{rating}
						</span>
						<span className="text-xs text-gray-400">
							({ratingCount})
						</span>
					</div>
				</div>

				{/* 2. Stats Row */}
				<div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-gray-400 font-medium mb-auto uppercase tracking-wide">
					<div className="flex items-center gap-1.5">
						<Users className="w-3.5 h-3.5" />
						<span>{_count?.enrollments || 0} học viên</span>
					</div>

					<div className="w-1 h-1 rounded-full bg-gray-300"></div>

					<div className="flex items-center gap-1.5">
						<Clock className="w-3.5 h-3.5" />
						<span>{formatDuration(duration)}</span>
					</div>

					<div className="w-1 h-1 rounded-full bg-gray-300"></div>

					<div className="flex items-center gap-1.5">
						<PlayCircle className="w-3.5 h-3.5" />
						<span>{lessons || 0} bài học</span>
					</div>
				</div>

				{/* Footer: Author */}
				<div className="pt-4 border-t border-gray-50 flex items-center gap-2 mt-4">
					<Avatar url={user?.avatarUrl} name={user?.name} size="xs" />
					<span className="text-xs font-bold text-gray-700 truncate max-w-[200px]">
						{user?.name}
					</span>
				</div>
			</div>
		</Link>
	);
}

export default CourseCard;
