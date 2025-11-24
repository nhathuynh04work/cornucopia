import StatusBadge from "@/components/Shared/StatusBadge";
import Avatar from "@/components/Shared/Avatar";
import { formatVNDate } from "@/lib/formatters";
import { Calendar, Clock } from "lucide-react";

export default function PostHeader({ post, readTime }) {
	return (
		<header className="space-y-6 border-b border-gray-100 pb-8 mb-8">
			<div className="space-y-4">
				<div className="flex items-center gap-3">
					{post.status !== "PUBLIC" && (
						<StatusBadge status={post.status} />
					)}
					<span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wide">
						Blog
					</span>
				</div>

				<h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
					{post.title}
				</h1>

				{post.excerpt && (
					<p className="text-lg md:text-xl text-gray-500 leading-relaxed font-medium">
						{post.excerpt}
					</p>
				)}
			</div>

			{/* Author & Meta Row */}
			<div className="flex items-center justify-between pt-2">
				<div className="flex items-center gap-3">
					<Avatar
						url={post.author?.avatarUrl}
						name={post.author?.name}
						size="md"
					/>
					<div>
						<p className="text-sm font-bold text-gray-900">
							{post.author?.name || "Ẩn danh"}
						</p>
						<div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
							<span className="flex items-center gap-1">
								<Calendar className="w-3 h-3" />
								{formatVNDate(post.updatedAt || post.createdAt)}
							</span>
							<span className="w-0.5 h-0.5 rounded-full bg-gray-300" />
							<span className="flex items-center gap-1">
								<Clock className="w-3 h-3" />
								{readTime} phút đọc
							</span>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
}
