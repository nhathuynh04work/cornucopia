import { Link } from "react-router-dom";
import { Calendar, MessageSquare } from "lucide-react";
import Avatar from "@/components/Avatar";

function PostCard({ post }) {
	const { id, title, excerpt, coverUrl, author, createdAt, _count } = post;

	const date = new Date(createdAt).toLocaleDateString("vi-VN", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});

	return (
		<Link
			to={`/posts/${id}`}
			className="group flex flex-col bg-white rounded-2xl border border-gray-200 hover:border-purple-200 hover:shadow-lg transition-all duration-300 h-full overflow-hidden">
			{/* Cover Image */}
			<div className="aspect-[16/9] w-full overflow-hidden bg-gray-100 relative">
				{coverUrl ? (
					<img
						src={coverUrl}
						alt={title}
						className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
					/>
				) : (
					<div className="w-full h-full bg-gradient-to-br from-purple-50 to-white flex items-center justify-center text-purple-200">
						<svg
							className="w-16 h-16 opacity-50"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="1">
							<rect
								x="3"
								y="3"
								width="18"
								height="18"
								rx="2"
								ry="2"
							/>
							<circle cx="8.5" cy="8.5" r="1.5" />
							<polyline points="21 15 16 10 5 21" />
						</svg>
					</div>
				)}
			</div>

			{/* Content */}
			<div className="p-6 flex-1 flex flex-col">
				<div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
					<span className="px-2 py-1 bg-gray-50 rounded-md border border-gray-100 font-medium">
						Blog
					</span>
					<span>•</span>
					<span className="flex items-center gap-1">
						<Calendar className="w-3 h-3" />
						{date}
					</span>
				</div>

				<h3 className="font-bold text-gray-900 text-xl line-clamp-2 mb-3 group-hover:text-purple-600 transition-colors leading-tight">
					{title}
				</h3>

				<p className="text-sm text-gray-500 line-clamp-3 mb-6 flex-1 leading-relaxed">
					{excerpt || "Không có trích dẫn."}
				</p>

				{/* Footer Info */}
				<div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
					<div className="flex items-center gap-3">
						<Avatar
							url={author?.avatarUrl}
							name={author?.name}
							size="xs"
						/>
						<span className="text-xs font-bold text-gray-700 truncate max-w-[120px]">
							{author?.name}
						</span>
					</div>
				</div>
			</div>
		</Link>
	);
}

export default PostCard;
