import { BookOpen } from "lucide-react";

export default function CitationChip({ citation }) {
	return (
		<button className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-[11px] font-medium text-gray-600 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700 transition-all shadow-sm max-w-full">
			<BookOpen className="w-3 h-3 flex-shrink-0" />
			<span className="truncate">{citation.title}</span>
		</button>
	);
}
