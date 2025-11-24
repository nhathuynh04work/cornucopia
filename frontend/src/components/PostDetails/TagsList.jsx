import { Link } from "react-router-dom";
import { Hash } from "lucide-react";

export default function TagsList({ tags }) {
	if (!tags || tags.length === 0) return null;

	return (
		<div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
			<h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
				<Hash className="w-4 h-4" /> Chủ đề liên quan
			</h3>
			<div className="flex flex-wrap gap-2">
				{tags.map((tag) => (
					<Link
						key={tag.id}
						to={`/posts?tag=${tag.name}`}
						className="px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-100 text-gray-600 text-xs font-medium hover:bg-purple-50 hover:text-purple-600 hover:border-purple-100 transition-all">
						#{tag.name}
					</Link>
				))}
			</div>
		</div>
	);
}
