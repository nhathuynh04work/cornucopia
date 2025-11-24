import { Hash } from "lucide-react";
import { Link } from "react-router";
import TagsList from "./TagsList";

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
			<TagsList tags={post?.tags} />
		</div>
	);
}
