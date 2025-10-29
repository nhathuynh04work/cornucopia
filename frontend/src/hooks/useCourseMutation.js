import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCourse } from "@/apis/courseApi";
import { toast } from "react-hot-toast";

export function useCreateCourseMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (courseData) => createCourse(courseData),
		onSuccess: () => {
			toast.success("Course created successfully!");
			queryClient.invalidateQueries({ queryKey: ["courses"] });
		},
		onError: (err) => {
			toast.error(err.message || "Failed to create course.");
		},
	});
}
