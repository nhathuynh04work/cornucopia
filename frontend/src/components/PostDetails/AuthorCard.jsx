import { Calendar, Clock } from "lucide-react";
import Avatar from "@/components/Shared/Avatar";
import { formatVNDate } from "@/lib/formatters";

export default function AuthorCard({ author, publishedAt, readTime }) {
	return (
		<div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
			<div className="flex items-center gap-4 mb-6">
				<Avatar url={author?.avatarUrl} name={author?.name} size="md" />
				<div>
					<p className="text-sm font-bold text-gray-900">
						{author?.name || "Ẩn danh"}
					</p>
					<p className="text-xs text-gray-500">Tác giả</p>
				</div>
			</div>

			<div className="space-y-3 pt-4 border-t border-gray-100">
				<div className="flex items-center justify-between text-sm text-gray-600">
					<div className="flex items-center gap-2">
						<Calendar className="w-4 h-4 text-gray-400" />
						<span>Đăng ngày</span>
					</div>
					<span className="font-medium text-gray-900">
						{formatVNDate(publishedAt)}
					</span>
				</div>
				<div className="flex items-center justify-between text-sm text-gray-600">
					<div className="flex items-center gap-2">
						<Clock className="w-4 h-4 text-gray-400" />
						<span>Thời gian đọc</span>
					</div>
					<span className="font-medium text-gray-900">
						{readTime} phút
					</span>
				</div>
			</div>
		</div>
	);
}
