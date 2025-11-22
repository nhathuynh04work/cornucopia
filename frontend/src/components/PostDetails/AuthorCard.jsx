import { Calendar, Clock } from "lucide-react";
import Avatar from "../Avatar";
import { formatVNDate } from "@/lib/text";

export default function AuthorCard({ author, publishedAt, readTime }) {
	return (
		<div className="p-5 bg-white border rounded-2xl shadow-sm">
			<div className="flex items-center gap-4 mb-4">
				<Avatar url={author.avatarUrl} />
				<h4 className="font-medium text-gray-900">{author.name}</h4>
			</div>

			<div className="pt-4 border-t flex flex-col gap-2 text-xs text-gray-500 font-medium">
				<div className="flex items-center justify-between">
					<span className="flex items-center gap-2">
						<Calendar className="w-3.5 h-3.5" /> Published
					</span>
					<span>{formatVNDate(publishedAt)}</span>
				</div>
				<div className="flex items-center justify-between">
					<span className="flex items-center gap-2">
						<Clock className="w-3.5 h-3.5" /> Read time
					</span>
					<span>{readTime} min read</span>
				</div>
			</div>
		</div>
	);
}
