import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as courseApi from "@/apis/courseApi";
import { toast } from "react-hot-toast";

export function useCreateCourse() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (courseData) => courseApi.create(courseData),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["courses"] });
		},
		onError: (err) => {
			toast.error(err.message || "Failed to create course.");
		},
	});
}

export function useUpdateCourse(courseId) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload) => courseApi.update(courseId, payload),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["courses"],
			});
			queryClient.invalidateQueries({
				queryKey: ["course", courseId],
			});
		},
		onError: (err) => {
			toast.error(err.message || "Failed to update course.");
		},
	});
}

export function useDeleteCourse(courseId) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => courseApi.remove(courseId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["courses"] });
		},
		onError: (err) => {
			toast.error(err.message || "Failed to delete course.");
		},
	});
}

export function useAddModule(courseId) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => courseApi.addModule(courseId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["courses"],
			});
			queryClient.invalidateQueries({
				queryKey: ["course", courseId],
			});
		},
		onError: (err) => {
			toast.error(err.message || "Failed to add module.");
		},
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
