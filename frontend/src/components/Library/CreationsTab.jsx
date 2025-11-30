import { Link } from "react-router-dom";
import {
	MonitorPlay,
	Layers,
	FileText,
	FileQuestion,
	Plus,
	Loader2,
	Star,
	Globe,
	Lock,
} from "lucide-react";
import Badge from "@/components/Shared/Badge";
import LibrarySection from "./LibrarySection";
import LibraryItemDelete from "./LibraryItemDelete";

const STATUS_MAP = {
	DRAFT: { variant: "default", label: "Nháp" },
	PUBLIC: { variant: "success", label: "Công khai" },
	ARCHIVED: { variant: "secondary", label: "Lưu trữ" },
	PRIVATE: { variant: "outline", label: "Riêng tư" },
};

const CreateButton = ({ onClick, isPending, label }) => (
	<button
		onClick={onClick}
		disabled={isPending}
		className="inline-flex items-center gap-1 text-sm font-bold text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg hover:bg-purple-100 transition-colors disabled:opacity-50">
		{isPending ? (
			<Loader2 className="w-4 h-4 animate-spin" />
		) : (
			<Plus className="w-4 h-4" />
		)}
		{label}
	</button>
);

export default function CreationsTab({
	data,
	isCreator,
	onCreate,
	onDelete,
	deletingId,
	creationLoading,
	formatDate,
}) {
	const getBadgeProps = (status) => {
		return STATUS_MAP[status] || STATUS_MAP.DRAFT;
	};

	console.log(data);

	return (
		<div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
			{/* --- My Courses --- */}
			{isCreator && (
				<LibrarySection
					title="Khóa học của tôi"
					items={data.courses}
					emptyIcon={MonitorPlay}
					emptyMessage="Bạn chưa tạo khóa học nào."
					action={
						<CreateButton
							label="Tạo mới"
							onClick={() => onCreate("khóa học")}
							isPending={creationLoading.course}
						/>
					}
					renderItem={(course) => {
						const badge = getBadgeProps(course.status);
						return (
							<Link
								to={`/courses/${course.id}/edit`}
								key={course.id}
								className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md hover:border-purple-200 transition-all group flex flex-col relative">
								<div className="h-40 w-full bg-gray-100 relative overflow-hidden">
									{course.coverUrl ? (
										<img
											src={course.coverUrl}
											alt=""
											className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
										/>
									) : (
										<div className="w-full h-full flex items-center justify-center bg-purple-50 text-purple-300">
											<MonitorPlay className="w-10 h-10" />
										</div>
									)}
									<div className="absolute top-3 left-3">
										<Badge
											variant={badge.variant}
											size="xs"
											className="bg-white/90 backdrop-blur border-0 shadow-sm">
											{badge.label}
										</Badge>
									</div>
									<LibraryItemDelete
										onDelete={() =>
											onDelete("khóa học", course.id)
										}
										itemName="khóa học"
										isDeleting={deletingId === course.id}
									/>
								</div>

								<div className="p-5 flex-1 flex flex-col">
									<h4
										className="font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3rem] group-hover:text-purple-700 transition-colors leading-tight"
										title={course.title}>
										{course.title}
									</h4>
									<div className="flex items-center gap-4 text-xs text-gray-500 mt-auto">
										<span>
											{course._count?.enrollments || 0}{" "}
											học viên
										</span>
										<span className="flex items-center gap-1 text-amber-500 font-bold">
											<Star className="w-3 h-3 fill-amber-500" />
											{course.stats?.rating || 0}
										</span>
									</div>
								</div>
							</Link>
						);
					}}
				/>
			)}

			{/* --- My Decks --- */}
			<LibrarySection
				title="Bộ thẻ Flashcard"
				items={data.decks}
				gridClass="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
				emptyIcon={Layers}
				emptyMessage="Bạn chưa tạo bộ thẻ nào."
				action={
					<CreateButton
						label="Tạo mới"
						onClick={() => onCreate("bộ thẻ")}
						isPending={creationLoading.deck}
					/>
				}
				renderItem={(deck) => (
					<Link
						to={`/decks/${deck.id}/edit`}
						key={deck.id}
						className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:border-purple-200 hover:shadow-md transition-all group flex flex-col relative">
						<div className="flex justify-between items-start mb-3">
							<div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center">
								<Layers className="w-5 h-5" />
							</div>
							<Badge
								variant={deck.isPublic ? "success" : "outline"}
								size="xs"
								icon={deck.isPublic ? Globe : Lock}>
								{deck.isPublic ? "Công khai" : "Riêng tư"}
							</Badge>
						</div>

						<LibraryItemDelete
							onDelete={() => onDelete("bộ thẻ", deck.id)}
							itemName="bộ thẻ"
							isDeleting={deletingId === deck.id}
						/>

						<h4
							className="font-bold text-gray-900 mb-1 group-hover:text-purple-700 transition-colors line-clamp-2 min-h-[3rem] leading-tight"
							title={deck.title}>
							{deck.title}
						</h4>
						<p className="text-xs text-gray-500 mt-auto">
							{deck.cardsCount || 0} thẻ • Cập nhật{" "}
							{formatDate(deck.updatedAt)}
						</p>
					</Link>
				)}
			/>

			{/* --- My Posts --- */}
			<LibrarySection
				title="Bài viết"
				items={data.posts}
				gridClass="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
				emptyIcon={FileText}
				emptyMessage="Bạn chưa có bài viết nào."
				action={
					<CreateButton
						label="Viết bài"
						onClick={() => onCreate("bài viết")}
						isPending={creationLoading.post}
					/>
				}
				renderItem={(post) => {
					const badge = getBadgeProps(post.status);
					return (
						<Link
							to={`/posts/${post.id}/edit`}
							key={post.id}
							className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:border-purple-200 hover:shadow-md transition-all group flex flex-col relative">
							<div className="h-32 w-full bg-gray-100 relative overflow-hidden">
								{post.coverUrl ? (
									<img
										src={post.coverUrl}
										alt={post.title}
										className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
									/>
								) : (
									<div className="w-full h-full flex items-center justify-center bg-teal-50 text-teal-300">
										<FileText className="w-10 h-10" />
									</div>
								)}
								<div className="absolute top-2 left-2">
									<Badge
										variant={badge.variant}
										size="xs"
										className="bg-white/90 backdrop-blur border-0 shadow-sm">
										{badge.label}
									</Badge>
								</div>
								<LibraryItemDelete
									onDelete={() =>
										onDelete("bài viết", post.id)
									}
									itemName="bài viết"
									isDeleting={deletingId === post.id}
								/>
							</div>

							<div className="p-4 flex-1 flex flex-col">
								<h4
									className="font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3rem] group-hover:text-purple-700 transition-colors leading-tight"
									title={post.title}>
									{post.title}
								</h4>
								<p className="text-xs text-gray-500 mt-auto">
									Cập nhật {formatDate(post.updatedAt)}
								</p>
							</div>
						</Link>
					);
				}}
			/>

			{/* --- My Tests --- */}
			{isCreator && (
				<LibrarySection
					title="Bài kiểm tra"
					items={data.tests}
					gridClass="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
					emptyIcon={FileQuestion}
					emptyMessage="Bạn chưa tạo đề thi nào."
					action={
						<CreateButton
							label="Tạo đề thi"
							onClick={() => onCreate("đề thi")}
							isPending={creationLoading.test}
						/>
					}
					renderItem={(test) => {
						const badge = getBadgeProps(test.status);
						return (
							<Link
								to={`/tests/${test.id}/edit`}
								key={test.id}
								className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:border-purple-200 hover:shadow-md transition-all group flex flex-col relative">
								<div className="flex justify-between items-start mb-3">
									<div className="w-10 h-10 rounded-lg bg-pink-50 text-pink-500 flex items-center justify-center">
										<FileQuestion className="w-5 h-5" />
									</div>
									<Badge variant={badge.variant} size="xs">
										{badge.label}
									</Badge>
								</div>

								<LibraryItemDelete
									onDelete={() => onDelete("đề thi", test.id)}
									itemName="đề thi"
									isDeleting={deletingId === test.id}
								/>

								<h4
									className="font-bold text-gray-900 mb-1 group-hover:text-purple-700 transition-colors line-clamp-2 min-h-[3rem] leading-tight"
									title={test.title}>
									{test.title}
								</h4>
								<p className="text-xs text-gray-500 mt-auto">
									{test._count?.attempts || 0} lượt thi • Cập
									nhật {formatDate(test.updatedAt)}
								</p>
							</Link>
						);
					}}
				/>
			)}
		</div>
	);
}
