import { Link } from "react-router";
import {
	ArrowLeft,
	Send,
	MoreVertical,
	Loader2,
	CheckCircle2,
	Cloud,
} from "lucide-react";

export default function EditorHeader({ isDirty, isSaving, onPublish }) {
	let statusLabel = "Saved";
	let StatusIcon = CheckCircle2;
	let statusColor = "text-gray-400";

	if (isSaving) {
		statusLabel = "Saving...";
		StatusIcon = Loader2;
		statusColor = "text-purple-600";
	} else if (isDirty) {
		statusLabel = "Unsaved changes";
		StatusIcon = Cloud;
		statusColor = "text-amber-500";
	}

	return (
		<nav className="h-[64px] shrink-0 z-50 bg-white border-b border-gray-100 px-6 flex items-center justify-between shadow-sm">
			<div className="flex items-center gap-4">
				<Link
					to="/posts"
					className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
					<ArrowLeft className="w-5 h-5" />
				</Link>
				<div className="flex flex-col">
					<span className="text-sm font-semibold text-gray-800">
						Editing Post
					</span>

					<div
						className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${statusColor}`}>
						<StatusIcon
							className={`w-3 h-3 ${
								isSaving ? "animate-spin" : ""
							}`}
						/>
						<span>{statusLabel}</span>
					</div>
				</div>
			</div>

			<div className="flex items-center gap-3">
				<button
					type="button"
					onClick={onPublish}
					className="flex items-center gap-2 px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow">
					<Send className="w-4 h-4" />
					Publish
				</button>

				<button type="button" className="sm:hidden p-2 text-gray-500">
					<MoreVertical className="w-5 h-5" />
				</button>
			</div>
		</nav>
	);
}
