import { Hash } from "lucide-react";
import { Link } from "react-router";

export default function PostContent({ post, htmlContent }) {
	return (
		<div className="space-y-8">
			{/* Featured Image */}
			{post.coverUrl && (
				<div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 aspect-video w-full">
					<img
						src={post.coverUrl}
						alt={post.title}
						className="w-full h-full object-cover"
					/>
				</div>
			)}

			{/* Main Content */}
			<article
				className="
                prose prose-lg max-w-none text-gray-800
                prose-headings:font-bold prose-headings:text-gray-900
                prose-p:leading-relaxed
                prose-a:text-purple-600 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-gray-900 prose-strong:font-semibold
                prose-img:rounded-2xl prose-img:shadow-md prose-img:my-8 prose-img:border prose-img:border-gray-100
                prose-blockquote:border-l-4 prose-blockquote:border-purple-500 prose-blockquote:bg-gray-50 prose-blockquote:py-2 prose-blockquote:pr-4 prose-blockquote:rounded-r-lg
            ">
				<div dangerouslySetInnerHTML={{ __html: htmlContent }} />
			</article>

			{/* Footer Tags */}
			{post.tags && post.tags.length > 0 && (
				<div className="pt-8 border-t border-gray-100 mt-12">
					<div className="flex items-center gap-2 mb-3">
						<Hash className="w-4 h-4 text-gray-400" />
						<span className="text-sm font-bold text-gray-500 uppercase tracking-wider">
							Chủ đề liên quan
						</span>
					</div>
					<div className="flex flex-wrap gap-2">
						{post.tags.map((tag) => (
							<Link
								key={tag.id}
								to={`/posts?tag=${tag.name}`}
								className="px-3 py-1.5 rounded-lg bg-gray-50 text-gray-600 text-sm font-medium hover:bg-purple-50 hover:text-purple-700 transition-colors">
								#{tag.name}
							</Link>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
