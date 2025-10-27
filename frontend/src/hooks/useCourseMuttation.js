import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCourse } from "@/apis/courseApi";
import { toast } from "react-hot-toast"; // Assuming you use react-hot-toast

export function useCreateCourseMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (courseData) => createCourse(courseData),
		onSuccess: () => {
			// This is the success toast
			toast.success("Course created successfully!");
			// This refetches the `useCoursesQuery`
			queryClient.invalidateQueries({ queryKey: ["courses"] });
		},
		onError: (err) => {
			// This is the error toast
			toast.error(err.message || "Failed to create course.");
		},
	});
}
