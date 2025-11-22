export default function PostContent({ post, htmlContent }) {
	return (
		<>
			{post.coverUrl && (
				<div className="mb-10 rounded-2xl overflow-hidden shadow-sm aspect-video bg-gray-100">
					<img
						src={post.coverUrl}
						alt={post.title}
						className="w-full h-full object-cover"
					/>
				</div>
			)}

			<article
				className="
                text-lg text-gray-700 leading-relaxed font-serif
                [&>h2]:font-sans [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-gray-900 [&>h2]:mt-10 [&>h2]:mb-4
                [&>h3]:font-sans [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:text-gray-900 [&>h3]:mt-8 [&>h3]:mb-3
                [&>p]:mb-6
                [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-6
                [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-6
                [&>blockquote]:border-l-4 [&>blockquote]:!border-purple-500 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:my-8 [&>blockquote]:text-gray-800 [&>blockquote]:bg-gray-50 [&>blockquote]:py-2 [&>blockquote]:pr-4
                [&>img]:rounded-xl [&>img]:shadow-md [&>img]:my-8 [&>img]:w-full
                [&>a]:text-purple-600 [&>a]:underline hover:[&>a]:text-purple-800
            ">
				<div dangerouslySetInnerHTML={{ __html: htmlContent }} />
			</article>
		</>
	);
}
