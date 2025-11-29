import { Star, MessageSquare, Loader2 } from "lucide-react";
import Avatar from "@/components/Shared/Avatar";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

export default function ReviewList({ reviews, isLoading }) {
	if (isLoading) {
		return (
			<div className="py-12 flex flex-col items-center justify-center text-gray-400">
				<Loader2 className="w-8 h-8 animate-spin mb-2 text-purple-500" />
				<p>Đang tải đánh giá...</p>
			</div>
		);
	}

	if (!reviews || reviews.length === 0) {
		return (
			<div className="py-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
				<MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
				<p className="text-gray-500">
					Chưa có đánh giá nào phù hợp với bộ lọc này.
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{reviews.map((review) => (
				<div
					key={review.id}
					className="flex gap-4 p-6 rounded-2xl bg-white border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300 hover:shadow-md transition-shadow">
					<Avatar
						src={review.user?.avatarUrl}
						name={review.user?.name}
						className="w-10 h-10"
					/>
					<div className="flex-1 space-y-2">
						<div className="flex items-center justify-between">
							<div>
								<h5 className="font-bold text-gray-900 text-sm">
									{review.user?.name}
								</h5>
								<span className="text-xs text-gray-400">
									{formatDistanceToNow(
										new Date(review.createdAt),
										{ addSuffix: true, locale: vi }
									)}
								</span>
							</div>
							<div className="flex gap-0.5">
								{[...Array(5)].map((_, i) => (
									<Star
										key={i}
										className={`w-3.5 h-3.5 ${
											i < review.rating
												? "text-purple-500 fill-purple-500"
												: "text-gray-200 fill-gray-200"
										}`}
									/>
								))}
							</div>
						</div>
						<p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
							{review.content}
						</p>
					</div>
				</div>
			))}
		</div>
	);
}
