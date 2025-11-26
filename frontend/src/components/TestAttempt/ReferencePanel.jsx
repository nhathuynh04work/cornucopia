import { Image as ImageIcon } from "lucide-react";
import MediaAttachment from "./MediaAttachment";

export default function ReferencePanel({ parentGroup }) {
	if (!parentGroup) return null;

	return (
		<div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col h-full overflow-hidden">
			<div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between flex-none">
				<span className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
					<ImageIcon className="w-4 h-4" />
					Tài liệu tham khảo
				</span>
			</div>
			<div className="p-6 flex-1 text-gray-700 leading-relaxed overflow-y-auto hide-scrollbar prose prose-purple max-w-none">
				<MediaAttachment mediaList={parentGroup.media} />
				<div dangerouslySetInnerHTML={{ __html: parentGroup.text }} />
			</div>
		</div>
	);
}
