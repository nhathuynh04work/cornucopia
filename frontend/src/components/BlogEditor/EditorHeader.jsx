import { Link } from "react-router";
import { ArrowLeft, Save, Send, MoreVertical } from "lucide-react";

export default function EditorHeader({ isDirty, onSaveDraft, onPublish }) {
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
					<span
						className={`text-xs font-medium ${
							isDirty ? "text-amber-600" : "text-gray-400"
						}`}>
						{isDirty ? "Unsaved changes" : "All changes saved"}
					</span>
				</div>
			</div>

			<div className="flex items-center gap-3">
				<button
					type="button"
					onClick={onSaveDraft}
					className="hidden sm:flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-200 rounded-lg text-sm font-medium transition-all">
					<Save className="w-4 h-4" />
					Save Draft
				</button>

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
