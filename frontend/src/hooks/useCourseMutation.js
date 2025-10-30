import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as courseApi from "@/apis/courseApi";
import { toast } from "react-hot-toast";

export function useCreateCourseMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (courseData) => courseApi.create(courseData),
		onSuccess: () => {
			toast.success("Course created successfully!");
			queryClient.invalidateQueries({ queryKey: ["courses"] });
		},
		onError: (err) => {
			toast.error(err.message || "Failed to create course.");
		},
	});
}

export function useUpdateCourseMutation(courseId) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload) => courseApi.update(courseId, payload),
		onSuccess: () => {
			toast.success("Course updated");

			// refetch the list of all courses
			queryClient.invalidateQueries({ queryKey: ["courses"] });
		},
		onError: (err) => {
			toast.error(err.message || "Failed to update course.");
		},
	});
}
