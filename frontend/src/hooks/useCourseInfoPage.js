import { useEffect } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import {
	usePublicCourseQuery,
	useEnrollmentStatusQuery,
} from "./useCourseQuery";
import { toast } from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateCheckoutSession } from "./useCourseMutation";

export function useCourseInfoPage() {
	const { id } = useParams();
	const [searchParams, setSearchParams] = useSearchParams();
	const { user } = useAuth();
	const queryClient = useQueryClient();

	// --- Data Fetching ---
	const { data: course, isPending: isCoursePending } =
		usePublicCourseQuery(id);
	const { data: isEnrolled, isPending: isEnrollmentPending } =
		useEnrollmentStatusQuery(id);

	// --- Mutation ---
	const { mutate: createCheckout, isPending: isCheckoutPending } =
		useCreateCheckoutSession(id);

	// --- Side Effects (for payment status) ---
	useEffect(() => {
		const paymentStatus = searchParams.get("payment");

		if (paymentStatus === "success") {
			toast.success("Payment successful! You are now enrolled.");
			queryClient.invalidateQueries({
				queryKey: ["course", Number(id), "enrollment", user?.id],
			});
			setSearchParams({}, { replace: true });
		} else if (paymentStatus === "canceled") {
			toast.error("Payment was canceled.");
			setSearchParams({}, { replace: true });
		}
	}, [searchParams, setSearchParams, id, user?.id, queryClient]);

	// --- Derived State ---
	const isPending = isCoursePending || (!!user && isEnrollmentPending);
	const totalModules = course?.modules?.length || 0;
	const totalLessons =
		course?.modules?.reduce((acc, mod) => acc + mod.lessons.length, 0) || 0;
	const isBusy = isCheckoutPending;

	return {
		isPending,
		course,
		totalModules,
		totalLessons,
		isEnrolled,
		isBusy,
		user,
		createCheckout,
	};
}
