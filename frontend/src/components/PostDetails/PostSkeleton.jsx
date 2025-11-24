export default function PostSkeleton() {
	return (
		<div className="max-w-[1200px] mx-auto p-6 animate-pulse">
			<div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
				<div className="space-y-8">
					{/* Header Skeleton */}
					<div className="space-y-4">
						<div className="h-12 bg-gray-200 rounded-lg w-3/4" />
						<div className="h-6 bg-gray-100 rounded w-2/3" />
					</div>
					{/* Content Box Skeleton */}
					<div className="bg-white rounded-3xl border border-gray-100 p-8 h-[600px]">
						<div className="w-full h-64 bg-gray-100 rounded-2xl mb-8" />
						<div className="space-y-4">
							<div className="h-4 bg-gray-100 rounded w-full" />
							<div className="h-4 bg-gray-100 rounded w-11/12" />
							<div className="h-4 bg-gray-100 rounded w-full" />
							<div className="h-4 bg-gray-100 rounded w-4/5" />
						</div>
					</div>
				</div>
				<div className="hidden lg:block space-y-6">
					<div className="h-40 bg-gray-200 rounded-2xl" />
					<div className="h-60 bg-gray-100 rounded-2xl" />
				</div>
			</div>
		</div>
	);
}
