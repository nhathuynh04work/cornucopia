import courseApi from "@/apis/courseApi";
import { useAuth } from "@/contexts/AuthContext";
import { queryDefaults } from "@/lib/react-query.config";
import { useQuery } from "@tanstack/react-query";

export function useGetCourses(params = {}) {
	return useQuery({
		queryKey: ["courses", params],
		queryFn: () => courseApi.getAll(params),
		...queryDefaults,
	});
}

export function useGetCourseDetails(courseId) {
	return useQuery({
		queryKey: ["course", courseId],
		queryFn: () => courseApi.getDetails(courseId),
		...queryDefaults,
		enabled: !!courseId,
	});
}

export function useGetCourseForInfoView(courseId) {
	const { user } = useAuth();
	const numericCourseId = Number(courseId);

	return useQuery({
		queryKey: ["course", numericCourseId, "info-view", user?.id],
		queryFn: () => courseApi.getForInfoView(numericCourseId),
		enabled: !!numericCourseId,
		...queryDefaults,
	});
}

export function useGetEnrollmentStatus(courseId) {
	const { user } = useAuth();
	const numericCourseId = Number(courseId);

	return useQuery({
		queryKey: ["course", numericCourseId, "enrollment", user?.id],
		queryFn: () => courseApi.getEnrollmentStatus(numericCourseId),
		enabled: !!numericCourseId && !!user,
		...queryDefaults,
	});
}

export function useGetCourseForEdit(courseId) {
	const numericCourseId = Number(courseId);

	return useQuery({
		queryKey: ["course", numericCourseId, "edit"],
		queryFn: () => courseApi.getForEditor(numericCourseId),
		enabled: !!numericCourseId,
		...queryDefaults,
	});
}

export function useGetCourseForLearning(courseId) {
	const numericCourseId = Number(courseId);

	return useQuery({
		queryKey: ["course", numericCourseId, "learn"],
		queryFn: () => courseApi.getForLearning(numericCourseId),
		enabled: !!numericCourseId,
		...queryDefaults,
	});
}

export function useGetCourseReviews(courseId, params = {}) {
	return useQuery({
		queryKey: ["course", Number(courseId), "reviews", params],
		queryFn: () => courseApi.getReviews(courseId, params),
		enabled: !!courseId,
		...queryDefaults,
	});
}
