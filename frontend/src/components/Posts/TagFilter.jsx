export default function TagFilter({ tags, activeTag, onSelect }) {
	if (!tags || tags.length === 0) return null;

	return (
		<div className="mb-4">
			<div className="flex items-center gap-2 overflow-x-auto scroll-container pb-2">
				<span className="text-sm font-medium text-gray-500 mr-2 shrink-0">
					Chủ đề:
				</span>
				<button
					onClick={() => onSelect(null)}
					className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all whitespace-nowrap ${
						!activeTag
							? "bg-gray-900 text-white border-gray-900"
							: "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
					}`}>
					Tất cả
				</button>
				{tags.map((tag) => (
					<button
						key={tag.id}
						onClick={() => onSelect(tag.name)}
						className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all whitespace-nowrap ${
							activeTag === tag.name
								? "bg-purple-600 text-white border-purple-600"
								: "bg-white text-gray-600 border-gray-200 hover:border-purple-200 hover:text-purple-600"
						}`}>
						#{tag.name}
					</button>
				))}
			</div>
		</div>
	);
}
