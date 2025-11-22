import { Link } from "react-router";
import { formatVNDate } from "@/lib/text";
import { Calendar, User, ImageIcon } from "lucide-react";
import StatusBadge from "../StatusBadge";

export default function PostCard({ post }) {
	const displayDate = formatVNDate(post.publishedAt ?? post.createdAt);
	const to =
		post.status === "DRAFT"
			? `/posts/${post.id}/edit`
			: `/posts/${post.id}`;

	return (
		<article className="group flex flex-col md:flex-row gap-6 p-5 bg-white rounded-xl border border-gray-200 transition-all duration-200">
			{/* Cover Image */}
			<Link
				to={to}
				className="shrink-0 block overflow-hidden rounded-lg w-full md:w-[240px] h-[160px] bg-gray-100 relative">
				{post.coverUrl ? (
					<img
						src={post.coverUrl}
						alt={post.title || "cover"}
						className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
					/>
				) : (
					<div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
						<ImageIcon className="w-8 h-8 mb-2 opacity-50" />
						<span className="text-xs">No image</span>
					</div>
				)}
			</Link>

			{/* Content */}
			<div className="flex flex-col flex-1">
				<div className="flex flex-wrap gap-2 mb-3">
					{post.tags.map((t) => (
						<Link key={t.id} to={`/tags/${t.id}`}>
							<StatusBadge
								status={t.name}
								size="xs"
								className="bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors cursor-pointer border !border-purple-100 lowercase"
							/>
						</Link>
					))}
				</div>

				{/* Title */}
				<h2 className="text-xl font-medium text-gray-800 leading-snug mb-2 group-hover:text-purple-600 transition-colors">
					<Link to={`/posts/${post.id}`}>
						{post.title || "(Không có tiêu đề)"}
					</Link>
				</h2>

				{/* Excerpt */}
				{post.excerpt && (
					<p className="text-sm text-gray-600 leading-relaxed line-clamp-2 mb-4 flex-1">
						{post.excerpt}
					</p>
				)}

				{/* Meta Footer */}
				<div className="flex items-center justify-between pt-2">
					<div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
						<div className="flex items-center gap-1.5">
							<User className="w-3.5 h-3.5" />
							<span>{post.author?.name || "Unknown"}</span>
						</div>
						<div className="flex items-center gap-1.5">
							<Calendar className="w-3.5 h-3.5" />
							<span>{displayDate}</span>
						</div>
					</div>

					{/* Post Status Badge */}
					{post.status && (
						<StatusBadge status={post.status} size="xs" />
					)}
				</div>
			</div>
		</article>
	);
}
