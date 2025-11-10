import { useEffect } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useCourseInfoView } from "./useCourseQuery";

export function useCourseInfoPage() {
	const { id } = useParams();
	const [searchParams, setSearchParams] = useSearchParams();
	const queryClient = useQueryClient();
	const numericCourseId = Number(id);

	const {
		data: course,
		isPending,
		isError,
	} = useCourseInfoView(numericCourseId);

	useEffect(() => {
		const paymentStatus = searchParams.get("payment");
		if (paymentStatus === "success") {
			toast.success("Payment successful! You are now enrolled.");
			queryClient.invalidateQueries({
				queryKey: ["course", numericCourseId, "info-view"],
			});
			setSearchParams({}, { replace: true });
		} else if (paymentStatus === "canceled") {
			toast.error("Payment was canceled.");
			setSearchParams({}, { replace: true });
		}
	}, [searchParams, setSearchParams, numericCourseId, queryClient]);

	const totalModules = course?.modules?.length || 0;
	const totalLessons =
		course?.modules?.reduce(
			(acc, mod) => acc + (mod.lessons?.length || 0),
			0
		) || 0;

	return {
		isPending,
		isError,
		course,
		totalModules,
		totalLessons,
	};
}
