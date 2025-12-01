import { useMutation, useQueryClient } from "@tanstack/react-query";
import courseApi from "@/apis/courseApi";
import { toast } from "react-hot-toast";
import { QUERY_KEYS } from "@/lib/query-keys";

export function useCreateCourse() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (courseData) => courseApi.createCourse(courseData),
		onSuccess: () => {
			// Original: ["courses"]
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.courses.all });
		},
		onError: () => toast.error("Không thể tạo khóa học."),
	});
}

export function useUpdateCourse() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }) => courseApi.updateCourse(id, data),
		onSuccess: (data) => {
			// Original: ["course", data.id, "edit"]
			queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.courses.edit(data.id),
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

export function useDeleteCourse() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ courseId }) => courseApi.deleteCourse(courseId),
		onSuccess: () => {
			// Original: ["courses"] and ["library"]
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.courses.all });
			queryClient.invalidateQueries({ queryKey: ["library"] });
		},
	});
}

export function useModuleMutations() {
	const queryClient = useQueryClient();

	const addModule = useMutation({
		mutationFn: ({ courseId, title }) =>
			courseApi.addModule(courseId, { title }),
		onSuccess: (_, { courseId }) => {
			// Original: ["course", Number(courseId), "edit"]
			queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.courses.edit(courseId),
			});
		},
		onError: () => toast.error("Lỗi khi thêm chương"),
	});

	const updateModule = useMutation({
		mutationFn: ({ moduleId, courseId, data }) =>
			courseApi.updateModule(moduleId, courseId, data),
		onSuccess: (_, { courseId }) => {
			queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.courses.edit(courseId),
			});
		},
	});

	const deleteModule = useMutation({
		mutationFn: ({ moduleId, courseId }) =>
			courseApi.deleteModule(moduleId, courseId),
		onSuccess: (_, { courseId }) => {
			queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.courses.edit(courseId),
			});
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
				queryKey: QUERY_KEYS.courses.edit(courseId),
			});
		},
	});

	const updateLesson = useMutation({
		mutationFn: ({ lessonId, moduleId, courseId, data }) =>
			courseApi.updateLesson(lessonId, moduleId, courseId, data),
		onSuccess: (_, { courseId }) => {
			queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.courses.edit(courseId),
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
				queryKey: QUERY_KEYS.courses.edit(courseId),
			});
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
			// Original: ["course", Number(courseId), "learn"]
			queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.courses.learn(courseId),
			});
			// Original: ["courses", "enrolled"]
			// We map this to a sub-key of courses.all to correspond with standardization
			queryClient.invalidateQueries({
				queryKey: [...QUERY_KEYS.courses.all, "enrolled"],
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

export function useReviewMutations(courseId) {
	const queryClient = useQueryClient();
	const numericId = Number(courseId);

	const invalidateContext = () => {
		// 1. Refresh the reviews list
		// Original: ["course", numericId, "reviews"]
		queryClient.invalidateQueries({
			queryKey: QUERY_KEYS.courses.reviews(numericId),
		});
		// 2. Refresh course details (Learn View) to update stats/userReview
		// Original: ["course", numericId, "learn"]
		queryClient.invalidateQueries({
			queryKey: QUERY_KEYS.courses.learn(numericId),
		});
		// 3. Refresh public info view (if needed)
		// Original: ["course", numericId, "info-view"]
		queryClient.invalidateQueries({
			queryKey: QUERY_KEYS.courses.infoView(numericId),
		});
	};

	const addReview = useMutation({
		mutationFn: (data) => courseApi.addReview(numericId, data),
		onSuccess: () => {
			toast.success("Cảm ơn bạn đã đánh giá!");
			invalidateContext();
		},
		onError: (error) => {
			toast.error(
				error?.response?.data?.message || "Không thể gửi đánh giá"
			);
		},
	});

	const updateReview = useMutation({
		mutationFn: ({ reviewId, data }) =>
			courseApi.updateReview(numericId, reviewId, data),
		onSuccess: () => {
			toast.success("Đã cập nhật đánh giá");
			invalidateContext();
		},
		onError: () => toast.error("Lỗi khi cập nhật đánh giá"),
	});

	const deleteReview = useMutation({
		mutationFn: (reviewId) => courseApi.deleteReview(numericId, reviewId),
		onSuccess: () => {
			toast.success("Đã xóa đánh giá");
			invalidateContext();
		},
		onError: () => toast.error("Lỗi khi xóa đánh giá"),
	});

	return { addReview, updateReview, deleteReview };
}
