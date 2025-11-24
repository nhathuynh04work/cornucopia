import { Link } from "react-router-dom";
import {
	Library,
	FileText,
	CheckCircle2,
	ArrowRight,
	BookOpen,
} from "lucide-react";

const ACTIVITY_CONFIG = {
	SESSION: {
		Icon: Library,
		color: "text-purple-500",
		label: "Học bộ thẻ",
		linkFn: (meta) => `/decks/${meta?.deckId}`,
	},
	TEST: {
		Icon: FileText,
		color: "text-blue-500",
		label: "Làm bài kiểm tra",
		linkFn: (meta) => `/tests/${meta?.testId}/result/${meta?.attemptId}`,
	},
	LESSON: {
		Icon: CheckCircle2,
		color: "text-green-500",
		label: "Hoàn thành bài học",
		linkFn: (meta) => `/courses/learn?lessonId=${meta?.lessonId}`,
	},
	COURSE: {
		Icon: BookOpen,
		color: "text-purple-500",
		label: "Khóa học",
		linkFn: (meta) => `/courses/${meta?.courseId}`,
	}, 
	DECK: {
		Icon: Library,
		color: "text-orange-500",
		label: "Bộ thẻ",
		linkFn: (meta) => `/decks/${meta?.deckId}`,
	},
	POST: {
		Icon: FileText,
		color: "text-pink-500",
		label: "Bài viết",
		linkFn: (meta) => `/posts/${meta?.postId}`,
	},
};

export default function ActivityListItem({ item }) {
	const config = ACTIVITY_CONFIG[item.type] || {};
	const Icon = config.Icon || ArrowRight;
	const link = config.linkFn ? config.linkFn(item.meta) : "#";

	return (
		<Link
			to={link}
			className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors group border border-gray-100 hover:border-purple-200">
			<div className="flex items-center gap-4 min-w-0">
				<div
					className={`w-10 h-10 bg-white rounded-full flex items-center justify-center ${config.color} shadow-sm transition-transform shrink-0 border border-gray-200`}>
					<Icon className="w-5 h-5" />
				</div>
				<div className="min-w-0">
					<h4 className="font-bold text-gray-900 text-sm truncate pr-2 group-hover:text-purple-600 transition-colors">
						{item.title}
					</h4>
					<p className="text-xs text-gray-500 truncate">
						{item.subtitle || config.label}
					</p>
				</div>
			</div>
			<span className="text-xs font-medium text-gray-400 shrink-0 ml-2">
				{new Date(item.date || item.updatedAt).toLocaleDateString(
					"vi-VN"
				)}
			</span>
		</Link>
	);
}
