function PostSkeleton() {
	return (
		<div className="w-5/6 mx-auto p-6 animate-pulse">
			<div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
				<main className="min-w-0">
					{/* Header Skeleton */}
					<div className="mb-8 border-b border-gray-100 pb-8 space-y-4">
						<div className="h-10 bg-gray-200 rounded-lg w-3/4" />
						<div className="h-6 bg-gray-100 rounded-md w-full" />
						<div className="h-6 bg-gray-100 rounded-md w-2/3" />
					</div>
					{/* Image Skeleton */}
					<div className="mb-10 rounded-2xl bg-gray-200 aspect-video w-full" />
					{/* Body Skeleton */}
					<div className="space-y-4">
						<div className="h-4 bg-gray-100 rounded w-full" />
						<div className="h-4 bg-gray-100 rounded w-11/12" />
						<div className="h-4 bg-gray-100 rounded w-full" />
						<div className="h-32 bg-gray-50 rounded w-full my-8" />{" "}
						{/* Blockquote */}
						<div className="h-4 bg-gray-100 rounded w-4/5" />
					</div>
				</main>
				{/* Sidebar Skeleton */}
				<aside className="hidden lg:block h-full space-y-8">
					<div className="h-4 w-24 bg-gray-200 rounded" />{" "}
					{/* Back link */}
					<div className="h-40 bg-gray-100 rounded-2xl" />{" "}
					{/* Author card */}
					<div className="h-20 bg-gray-50 rounded-xl" /> {/* Tags */}
				</aside>
			</div>
		</div>
	);
}

export default PostSkeleton;
