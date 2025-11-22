export default function PostHeader({ post }) {
	return (
		<header className="mb-8 border-b pb-8">
			<div className="lg:hidden flex flex-wrap gap-2 mb-4">
				{post.tags.map((tag) => (
					<span
						key={tag.name}
						className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-md">
						#{tag.name}
					</span>
				))}
			</div>

			<h1 className="text-3xl md:text-4xl lg:text-5xl font-medium text-gray-900 mb-6 leading-tight">
				{post.title}
			</h1>

			{post.excerpt && (
				<p className="text-xl text-gray-500 italic leading-relaxed mb-6 font-serif">
					{post.excerpt}
				</p>
			)}
		</header>
	);
}
