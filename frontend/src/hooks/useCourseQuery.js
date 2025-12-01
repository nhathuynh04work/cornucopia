import courseApi from "@/apis/courseApi";
import { useAuth } from "@/contexts/AuthContext";
import { queryDefaults } from "@/lib/react-query.config";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/query-keys";

export function useGetCourses(params = {}) {
	return useQuery({
		queryKey: QUERY_KEYS.courses.list(params),
		queryFn: () => courseApi.getAll(params),
		...queryDefaults,
	});
}

export function useGetCourseDetails(courseId) {
	return useQuery({
		queryKey: QUERY_KEYS.courses.detail(courseId),
		queryFn: () => courseApi.getDetails(courseId),
		...queryDefaults,
		enabled: !!courseId,
	});
}

export function useGetCourseForInfoView(courseId) {
	const { user } = useAuth();
	const numericCourseId = Number(courseId);

	return useQuery({
		queryKey: QUERY_KEYS.courses.infoView(numericCourseId, user?.id),
		queryFn: () => courseApi.getForInfoView(numericCourseId),
		enabled: !!numericCourseId,
		...queryDefaults,
	});
}

export function useGetEnrollmentStatus(courseId) {
	const { user } = useAuth();
	const numericCourseId = Number(courseId);

	return useQuery({
		queryKey: QUERY_KEYS.courses.enrollment(numericCourseId, user?.id),
		queryFn: () => courseApi.getEnrollmentStatus(numericCourseId),
		enabled: !!numericCourseId && !!user,
		...queryDefaults,
	});
}

export function useGetCourseForEdit(courseId) {
	const numericCourseId = Number(courseId);

	return useQuery({
		queryKey: QUERY_KEYS.courses.edit(numericCourseId),
		queryFn: () => courseApi.getForEditor(numericCourseId),
		enabled: !!numericCourseId,
		...queryDefaults,
	});
}

export function useGetCourseForLearning(courseId) {
	const numericCourseId = Number(courseId);

	return useQuery({
		queryKey: QUERY_KEYS.courses.learn(numericCourseId),
		queryFn: () => courseApi.getForLearning(numericCourseId),
		enabled: !!numericCourseId,
		...queryDefaults,
	});
}

export function useGetCourseReviews(courseId, params = {}) {
	return useQuery({
		queryKey: QUERY_KEYS.courses.reviews(Number(courseId), params),
		queryFn: () => courseApi.getReviews(courseId, params),
		enabled: !!courseId,
		...queryDefaults,
	});
}
