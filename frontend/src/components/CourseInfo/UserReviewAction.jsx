import { Star, Edit, Trash2, PenLine } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

export default function UserReviewAction({
	isEnrolled,
	userReview,
	onWrite,
	onEdit,
	onDelete,
}) {
	if (!isEnrolled) return null;

	return (
		<div className="animate-in fade-in slide-in-from-top-2 duration-300">
			{userReview ? (
				// CASE 1: USER HAS REVIEWED (New Design)
				<div className="bg-purple-50 border border-purple-100 rounded-2xl p-6 relative overflow-hidden group">
					<div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
						<Star className="w-24 h-24 text-purple-600 fill-purple-600 rotate-12" />
					</div>

					<div className="flex flex-col sm:flex-row gap-6 relative z-10">
						<div className="flex-1">
							<div className="flex items-center gap-2 mb-2">
								<h4 className="font-bold text-purple-900 text-lg">
									Đánh giá của bạn
								</h4>
								<span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
									{userReview.rating}/5
								</span>
							</div>

							<div className="flex gap-1 mb-3">
								{[...Array(5)].map((_, i) => (
									<Star
										key={i}
										className={`w-4 h-4 ${
											i < userReview.rating
												? "text-purple-600 fill-purple-600"
												: "text-purple-200 fill-purple-200"
										}`}
									/>
								))}
							</div>

							<p className="text-purple-800 text-sm leading-relaxed mb-3">
								{userReview.content || (
									<span className="italic opacity-60">
										Không có nội dung nhận xét.
									</span>
								)}
							</p>

							<span className="text-xs text-purple-400 font-medium">
								Đã đăng{" "}
								{formatDistanceToNow(
									new Date(userReview.createdAt),
									{ addSuffix: true, locale: vi }
								)}
							</span>
						</div>

						<div className="flex flex-row sm:flex-col gap-2 justify-end sm:justify-start shrink-0">
							<button
								onClick={onEdit}
								className="flex items-center justify-center gap-2 px-4 py-2 bg-white text-purple-700 font-bold text-sm rounded-xl shadow-sm hover:shadow-md hover:bg-purple-50 transition-all border border-purple-100">
								<Edit className="w-4 h-4" />
								<span className="hidden sm:inline">
									Chỉnh sửa
								</span>
								<span className="sm:hidden">Sửa</span>
							</button>
							<button
								onClick={onDelete}
								className="flex items-center justify-center gap-2 px-4 py-2 bg-white text-red-500 font-bold text-sm rounded-xl shadow-sm hover:shadow-md hover:bg-red-50 hover:text-red-600 transition-all border border-purple-100 hover:border-red-100">
								<Trash2 className="w-4 h-4" />
								<span className="hidden sm:inline">Xóa</span>
								<span className="sm:hidden">Xóa</span>
							</button>
						</div>
					</div>
				</div>
			) : (
				// CASE 2: NO REVIEW YET (CTA)
				<div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
					<div className="text-center sm:text-left">
						<h4 className="font-bold text-xl mb-2">
							Bạn cảm thấy khóa học thế nào?
						</h4>
						<p className="text-purple-100 text-sm max-w-md">
							Chia sẻ trải nghiệm của bạn để giúp đỡ các học viên
							khác và giúp giảng viên cải thiện chất lượng khóa
							học nhé.
						</p>
					</div>
					<button
						onClick={onWrite}
						className="px-6 py-3 bg-white text-purple-600 font-bold rounded-xl hover:bg-purple-50 transition-all shadow-md hover:shadow-lg flex items-center gap-2 shrink-0 group">
						<PenLine className="w-4 h-4 group-hover:rotate-12 transition-transform" />
						Viết đánh giá
					</button>
				</div>
			)}
		</div>
	);
}
