// frontend/src/hooks/useCourseMutation.js
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

export function useUpdateCourse() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }) => courseApi.updateCourse(id, data),
		onSuccess: (data) => {
			// Invalidate the specific course edit query
			queryClient.invalidateQueries({
				queryKey: ["course", data.id, "edit"],
			});
		},
		onError: (error) => {
			console.error(error);
			toast.error(
				error?.response?.data?.message || "Lỗi khi cập nhật khóa học"
			);
		},
	});
}

export function useModuleMutations() {
	const queryClient = useQueryClient();

	const addModule = useMutation({
		mutationFn: ({ courseId, title }) =>
			courseApi.addModule(courseId, { title }),
		onSuccess: (_, { courseId }) => {
			queryClient.invalidateQueries({
				queryKey: ["course", Number(courseId), "edit"],
			});
			toast.success("Đã thêm chương mới");
		},
		onError: () => toast.error("Lỗi khi thêm chương"),
	});

	const updateModule = useMutation({
		mutationFn: ({ moduleId, courseId, data }) =>
			courseApi.updateModule(moduleId, courseId, data),
		onSuccess: (_, { courseId }) => {
			// Silent success for auto-save feel, or minimal toast if needed
			queryClient.invalidateQueries({
				queryKey: ["course", Number(courseId), "edit"],
			});
		},
	});

	const deleteModule = useMutation({
		mutationFn: ({ moduleId, courseId }) =>
			courseApi.deleteModule(moduleId, courseId),
		onSuccess: (_, { courseId }) => {
			queryClient.invalidateQueries({
				queryKey: ["course", Number(courseId), "edit"],
			});
			toast.success("Đã xóa chương");
		},
	});

	return { addModule, updateModule, deleteModule };
}

export function useLessonMutations() {
	const queryClient = useQueryClient();

	const addLesson = useMutation({
		mutationFn: ({ moduleId, courseId, title, type }) =>
			courseApi.addLesson(moduleId, courseId, { title, type }),
		onSuccess: (_, { courseId }) => {
			queryClient.invalidateQueries({
				queryKey: ["course", Number(courseId), "edit"],
			});
			toast.success("Đã thêm bài học");
		},
	});

	const updateLesson = useMutation({
		mutationFn: ({ lessonId, moduleId, courseId, data }) =>
			courseApi.updateLesson(lessonId, moduleId, courseId, data),
		onSuccess: (_, { courseId }) => {
			queryClient.invalidateQueries({
				queryKey: ["course", Number(courseId), "edit"],
			});
		},
		onError: (error) => {
			toast.error(
				error?.response?.data?.message || "Lỗi cập nhật bài học"
			);
		},
	});

	const deleteLesson = useMutation({
		mutationFn: ({ lessonId, moduleId, courseId }) =>
			courseApi.deleteLesson(lessonId, moduleId, courseId),
		onSuccess: (_, { courseId }) => {
			queryClient.invalidateQueries({
				queryKey: ["course", Number(courseId), "edit"],
			});
			toast.success("Đã xóa bài học");
		},
	});

	return { addLesson, updateLesson, deleteLesson };
}

export function useUpdateLessonProgress() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ courseId, moduleId, lessonId, isCompleted }) =>
			courseApi.updateLessonProgress(
				courseId,
				moduleId,
				lessonId,
				isCompleted
			),
		onSuccess: (_, { courseId }) => {
			queryClient.invalidateQueries({
				queryKey: ["course", Number(courseId), "learn"],
			});
			queryClient.invalidateQueries({
				queryKey: ["courses", "enrolled"],
			});
		},
		onError: () => {
			toast.error("Cập nhật tiến độ thất bại");
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
