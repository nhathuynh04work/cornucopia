import { Link } from "react-router-dom";
import { Hash } from "lucide-react";

export default function TagsList({ tags }) {
	if (!tags || tags.length === 0) return null;

	return (
		<div className="pt-8 border-t border-gray-100 mt-12">
			<div className="flex items-center gap-2 mb-3">
				<Hash className="w-4 h-4 text-gray-400" />
				<span className="text-sm font-bold text-gray-500 uppercase tracking-wider">
					Chủ đề liên quan
				</span>
			</div>
			<div className="flex flex-wrap gap-2">
				{tags.map((tag) => (
					<Link
						key={tag.id}
						to={`/posts?tag=${tag.name}`}
						className="px-3 py-1.5 rounded-lg bg-gray-50 text-gray-600 text-sm font-medium hover:bg-purple-50 hover:text-purple-700 transition-colors">
						#{tag.name}
					</Link>
				))}
			</div>
		</div>
	);
}
