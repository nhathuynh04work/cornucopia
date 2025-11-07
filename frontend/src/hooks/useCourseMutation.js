import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as courseApi from "@/apis/courseApi";
import { toast } from "react-hot-toast";
import { useCourseEditorStore } from "@/store/courseEditorStore";

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
	const setCourse = useCourseEditorStore((s) => s.setCourse);

	return useMutation({
		mutationFn: (payload) => courseApi.update(courseId, payload),
		onSuccess: (course) => {
			setCourse(course);
			toast.success("Course updated");
		},
		onError: (err) => {
			toast.error(err.message || "Failed to update course.");
		},
	});
}

export function useAddModuleMutation(courseId) {
	const addModule = useCourseEditorStore((s) => s.addModule);

	return useMutation({
		mutationFn: () => courseApi.addModule(courseId),
		onSuccess: (module) => {
			addModule(module);
			toast.success("Module added");
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
