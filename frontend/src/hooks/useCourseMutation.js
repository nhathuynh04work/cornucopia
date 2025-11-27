import { useMutation, useQueryClient } from "@tanstack/react-query";
import courseApi from "@/apis/courseApi";
import { toast } from "react-hot-toast";

export function useCreateCourse() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (courseData) => courseApi.createCourse(courseData),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["courses"] });
		},
		onError: () => toast.error("Không thể tạo khóa học."),
	});
}

export function useCreateCheckoutSession(courseId) {
	return useMutation({
		mutationFn: () => courseApi.createCheckoutSession(courseId),
		onSuccess: (url) => {
			window.location.href = url;
		},
		onError: (err) => {
			toast.error(err.message || "Failed to start checkout.");
		},
	});
}
