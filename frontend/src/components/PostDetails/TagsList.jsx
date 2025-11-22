import { Link } from "react-router";
import { Tag } from "lucide-react";

export default function TagsList({ tags }) {
	return (
		<div>
			<h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 mb-3">
				<Tag className="w-3 h-3" /> Tags
			</h3>
			<div className="flex flex-wrap gap-2">
				{tags.map((tag) => (
					<Link
						key={tag.id}
						to={`/tags/${tag.id}`}
						className="px-2.5 py-1 rounded-md bg-gray-50 border text-gray-600 text-xs font-medium hover:bg-purple-50 hover:text-purple-600 hover:!border-purple-100 transition-all">
						#{tag.name}
					</Link>
				))}
			</div>
		</div>
	);
}
