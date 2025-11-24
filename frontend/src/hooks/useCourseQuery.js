import courseApi from "@/apis/courseApi";
import { useAuth } from "@/contexts/AuthContext";
import { Role } from "@/lib/constants";
import { queryDefaults } from "@/lib/react-query.config";
import { useCourseEditorStore } from "@/store/courseEditorStore";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

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

export function useGteCourseForEdit(courseId) {
	const setCourse = useCourseEditorStore((s) => s.setCourse);
	const numericCourseId = Number(courseId);

	const query = useQuery({
		queryKey: ["course", numericCourseId, "edit"],
		queryFn: () => courseApi.getForEditor(numericCourseId),
		enabled: !!numericCourseId,
		...queryDefaults,
	});

	useEffect(() => {
		if (query.data) {
			setCourse(query.data);
		}
	}, [query.data, setCourse]);

	return query;
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

export function useEnrolledCourses() {
	const { user } = useAuth();

	return useQuery({
		queryKey: ["courses", "enrolled", user?.id],
		queryFn: courseApi.getEnrolledCourses,
		enabled: !!user,
		...queryDefaults,
	});
}

export function useMyCourses() {
	const { user, role } = useAuth();

	return useQuery({
		queryKey: ["courses", "my-courses", user?.id],
		queryFn: courseApi.getMyCourses,
		enabled: !!user && role !== Role.USER,
		...queryDefaults,
	});
}
