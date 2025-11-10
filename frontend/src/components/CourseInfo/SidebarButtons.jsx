import { useAuth } from "@/contexts/AuthContext";
import { useCreateCheckoutSession } from "@/hooks/useCourseMutation";
import { useEnrollmentStatus } from "@/hooks/useCourseQuery";
import NavButton from "../NavButton";
import { Edit, Loader2, Play } from "lucide-react";
import { formatVNDate } from "@/lib/text";

function SidebarButtons({ course }) {
	const { user } = useAuth();
	const { data: enrollment, isPending: isLoading } = useEnrollmentStatus(
		course.id
	);
	const { mutate: createCheckout, isPending } = useCreateCheckoutSession(
		course.id
	);

	const isOwner = user?.id === course.userId;
	const isEnrolled = Boolean(enrollment);
	const canBuy = !isOwner && !isEnrolled;
	const canLearn = isOwner || isEnrolled;
	const canEdit = isOwner;

	if (!user) {
		return (
			<NavButton
				to="/login"
				className="flex w-full items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 mb-6">
				Log in to purchase
			</NavButton>
		);
	}

	if (isLoading) {
		return (
			<div className="flex justify-center items-center py-6">
				<Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
			</div>
		);
	}

	return (
		<div className="mb-8 space-y-3">
			{/* --- Buy button --- */}
			{canBuy && (
				<>
					<p className="text-3xl font-bold text-gray-900 mb-6">
						${(course.price / 100).toFixed(2)}
					</p>
					<button
						onClick={createCheckout}
						disabled={isPending}
						className="flex w-full items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:bg-purple-400">
						{isPending ? (
							<>
								<Loader2 className="w-4 h-4 animate-spin" />
								Processing...
							</>
						) : (
							"Buy Now"
						)}
					</button>
				</>
			)}

			{/* --- Start Learning button --- */}
			{canLearn && (
				<NavButton
					to={`/courses/${course.id}/learn`}
					className="flex w-full items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700">
					<Play className="w-4 h-4" />
					Start Learning
				</NavButton>
			)}

			{/* --- Enrollment info (non-owner only) --- */}
			{!isOwner && isEnrolled && (
				<p className="text-xs text-gray-500 text-center">
					Enrolled on{" "}
					<span className="font-medium text-gray-700">
						{formatVNDate(enrollment.createdAt)}
					</span>
				</p>
			)}

			{/* --- Edit button --- */}
			{canEdit && (
				<NavButton
					to={`/courses/${course.id}/edit`}
					className="flex w-full items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
					<Edit className="w-4 h-4" />
					Edit Course
				</NavButton>
			)}
		</div>
	);
}

export default SidebarButtons;
