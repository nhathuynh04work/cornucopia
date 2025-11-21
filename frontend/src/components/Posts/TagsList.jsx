import { getAllTags } from "@/apis/tagApi";
import { useQuery } from "@tanstack/react-query";
import { NavLink } from "react-router-dom";
import { Hash, AlertCircle, Sparkles } from "lucide-react";

export default function TagsList() {
	const {
		data: tags,
		isPending,
		isError,
	} = useQuery({
		queryKey: ["tags"],
		queryFn: getAllTags,
	});

	if (isPending) return <TagsSkeleton />;
	if (isError) return <TagsError />;

	return (
		<aside className="md:col-span-1">
			<div className="bg-white rounded-2xl border p-5 sticky top-24">
				{/* Header */}
				<div className="flex items-center gap-2 mb-5 pb-3 border-b border-gray-50">
					<div className="p-1.5 bg-purple-100 text-purple-600 rounded-md">
						<Sparkles className="w-4 h-4" />
					</div>
					<h2 className="text-base font-bold text-gray-800 uppercase tracking-wide">
						Khám phá
					</h2>
				</div>

				{/* Tag Cloud */}
				<div className="flex flex-wrap gap-2">
					{tags.length > 0 ? (
						tags.map((t) => (
							<NavLink
								key={t.id}
								to={`/tags/${t.id}`}
								className={({ isActive }) =>
									`group relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
										isActive
											? "bg-gray-900 text-white border-gray-900 shadow-md shadow-gray-200 scale-105"
											: "bg-gray-50 text-gray-600 border-transparent hover:bg-white hover:border-purple-200 hover:text-purple-600 hover:shadow-sm hover:-translate-y-0.5"
									}`
								}>
								<Hash className="w-3 h-3 opacity-40" />
								<span>{t.name}</span>
								{t._count?.posts > 0 && (
									<span className="ml-0.5 text-[10px] opacity-60 font-bold">
										{t._count.posts}
									</span>
								)}
							</NavLink>
						))
					) : (
						<div className="w-full text-center py-6 text-gray-400 text-xs italic bg-gray-50/50 rounded-lg border border-dashed border-gray-100">
							Chưa có chủ đề nào.
						</div>
					)}
				</div>
			</div>
		</aside>
	);
}

function TagsSkeleton() {
	return (
		<div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm sticky top-24">
			<div className="flex items-center gap-2 mb-5 pb-3 border-b border-gray-50">
				<div className="w-7 h-7 bg-gray-100 rounded-md animate-pulse" />
				<div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
			</div>
			<div className="flex flex-wrap gap-2">
				{[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
					<div
						key={i}
						className="h-8 bg-gray-50 rounded-full animate-pulse"
						style={{
							width: Math.max(60, Math.random() * 100) + "px",
						}}
					/>
				))}
			</div>
		</div>
	);
}

function TagsError() {
	return (
		<div className="bg-white rounded-2xl border border-red-100 p-6 flex flex-col items-center text-center shadow-sm">
			<div className="w-10 h-10 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-3">
				<AlertCircle className="w-5 h-5" />
			</div>
			<span className="text-sm font-medium text-gray-800">
				Lỗi tải dữ liệu
			</span>
			<span className="text-xs text-gray-500 mt-1">
				Không thể tải danh sách chủ đề
			</span>
		</div>
	);
}
