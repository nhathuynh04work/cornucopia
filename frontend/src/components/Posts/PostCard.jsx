import { Link } from "react-router-dom";
import { Calendar, Clock } from "lucide-react";
import Avatar from "@/components/Shared/Avatar";
import StatusBadge from "@/components/Shared/StatusBadge";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

function PostCard({ post }) {
	console.log(post);
	const {
		id,
		title,
		excerpt,
		coverUrl,
		author,
		createdAt,
		readTime,
		status,
		tags,
	} = post;

	const isDraft = status === "DRAFT";
	const targetLink = isDraft ? `/posts/${id}/edit` : `/posts/${id}`;

	const timeAgo = createdAt
		? formatDistanceToNow(new Date(createdAt), {
				addSuffix: true,
				locale: vi,
		  })
		: "";

	return (
		<Link
			to={targetLink}
			className="group flex flex-col md:flex-row bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-purple-200 transition-all duration-300 h-full relative">
			{/* --- IMAGE SECTION (Left Side) --- */}
			<div className="w-full md:w-72 shrink-0 relative overflow-hidden bg-gray-100">
				<div className="aspect-video md:h-full md:aspect-auto relative">
					{coverUrl ? (
						<img
							src={coverUrl}
							alt={title}
							className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
						/>
					) : (
						<div className="w-full h-full flex items-center justify-center bg-purple-50 text-purple-300 font-bold text-xl">
							BLOG
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
				</div>
			</div>

			{/* --- CONTENT SECTION (Right Side) --- */}
			<div className="flex-1 p-5 flex flex-col min-w-0">
				{/* Header */}
				<div className="flex justify-between items-start gap-4 mb-2">
					<div className="space-y-2">
						{/* Tags as Metadata Badges */}
						{tags && tags.length > 0 && (
							<div className="flex flex-wrap items-center gap-2">
								{tags.slice(0, 3).map((tag) => (
									<span
										key={tag.name}
										className="text-[10px] font-bold tracking-wider uppercase text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">
										{tag.name}
									</span>
								))}
							</div>
						)}

						<h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-purple-700 transition-colors line-clamp-2">
							{title}
						</h3>
					</div>
				</div>

				{/* Excerpt */}
				<p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">
					{excerpt || "Chưa có tóm tắt cho bài viết này."}
				</p>

				{/* Stats Row */}
				<div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-gray-400 font-medium mb-auto uppercase tracking-wide mt-auto">
					<div className="flex items-center gap-1.5">
						<Calendar className="w-3.5 h-3.5" />
						<span>{timeAgo}</span>
					</div>

					<div className="w-1 h-1 rounded-full bg-gray-300"></div>

					<div className="flex items-center gap-1.5">
						<Clock className="w-3.5 h-3.5" />
						<span>{readTime || "5 phút đọc"}</span>
					</div>
				</div>

				{/* Footer: Author */}
				<div className="pt-4 border-t border-gray-50 flex items-center gap-2 mt-4">
					<Avatar
						url={author?.avatarUrl}
						name={author?.name}
						size="xs"
					/>
					<span className="text-xs font-bold text-gray-700 truncate max-w-[200px]">
						{author?.name}
					</span>
				</div>
			</div>
		</Link>
	);
}

export default PostCard;
