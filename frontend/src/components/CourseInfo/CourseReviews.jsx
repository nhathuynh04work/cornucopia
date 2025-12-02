import { useState } from "react";
import { useGetCourseReviews } from "@/hooks/useCourseQuery";
import { useReviewMutations } from "@/hooks/useCourseMutation";
import ReviewModal from "./ReviewModal";

import ReviewSummary from "./ReviewSummary";
import ReviewFilters from "./ReviewFilters";
import ReviewList from "./ReviewList";
import UserReviewAction from "./UserReviewAction";

export default function CourseReviews({ course, isEnrolled }) {
	const [sort, setSort] = useState("newest");
	const [ratingFilter, setRatingFilter] = useState("all");
	const [isModalOpen, setIsModalOpen] = useState(false);

	// Fetch Data
	const { data: reviewsData, isLoading } = useGetCourseReviews(course.id, {
		sort,
		rating: ratingFilter !== "all" ? Number(ratingFilter) : undefined,
	});

	// Mutations
	const { addReview, updateReview, deleteReview } = useReviewMutations(
		course.id
	);

	const userReview = course.userReview;
	const stats = course.stats || { rating: 0, ratingCount: 0, ratingDist: [] };

	// Handlers
	const handleSubmitReview = (data) => {
		if (userReview) {
			updateReview.mutate(
				{ reviewId: userReview.id, data },
				{
					onSuccess: () => setIsModalOpen(false),
				}
			);
		} else {
			addReview.mutate(data, {
				onSuccess: () => setIsModalOpen(false),
			});
		}
	};

	const handleDeleteReview = () => {
		if (confirm("Bạn có chắc chắn muốn xóa đánh giá này?")) {
			deleteReview.mutate(userReview.id);
		}
	};

	return (
		<div className="space-y-10 p-6 md:p-8">
			{/* 1. Statistics */}
			<ReviewSummary stats={stats} />

			{/* 2. User Action (CTA or Edit/Delete Card) */}
			<UserReviewAction
				isEnrolled={isEnrolled}
				userReview={userReview}
				onWrite={() => setIsModalOpen(true)}
				onEdit={() => setIsModalOpen(true)}
				onDelete={handleDeleteReview}
			/>

			{/* 3. Filter Controls */}
			<ReviewFilters
				ratingFilter={ratingFilter}
				setRatingFilter={setRatingFilter}
				sort={sort}
				setSort={setSort}
			/>

			{/* 4. List of Reviews */}
			<ReviewList reviews={reviewsData?.reviews} isLoading={isLoading} />

			{/* Modal */}
			{isModalOpen && (
				<ReviewModal
					key={userReview?.id || "new"}
					onClose={() => setIsModalOpen(false)}
					onSubmit={handleSubmitReview}
					initialData={userReview}
					isSubmitting={addReview.isPending || updateReview.isPending}
				/>
			)}
		</div>
	);
}
