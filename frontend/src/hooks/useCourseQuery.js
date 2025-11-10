import * as courseApi from "@/apis/courseApi";
import { useAuth } from "@/contexts/AuthContext";
import { useCourseEditorStore } from "@/store/courseEditorStore";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export function useCoursesQuery() {
	return useQuery({
		queryKey: ["courses"],
		queryFn: courseApi.getCourses,
	});
}

export function useCourseInfoView(courseId) {
	const { user } = useAuth();
	const numericCourseId = Number(courseId);

	return useQuery({
		queryKey: ["course", numericCourseId, "info-view", user?.id],
		queryFn: () => courseApi.getCourseForInfoView(numericCourseId),
		enabled: !!numericCourseId,
	});
}

export function useEnrollmentStatus(courseId) {
	const { user } = useAuth();
	const numericCourseId = Number(courseId);

	return useQuery({
		queryKey: ["course", numericCourseId, "enrollment", user?.id],
		queryFn: () => courseApi.getEnrollmentStatus(numericCourseId),
		enabled: !!numericCourseId && !!user,
		staleTime: 1000 * 60 * 5,
	});
}

export function useCourseEditorQuery(courseId) {
	const setCourse = useCourseEditorStore((s) => s.setCourse);
	const numericCourseId = Number(courseId);

	const query = useQuery({
		queryKey: ["course", numericCourseId, "edit"],
		queryFn: () => courseApi.getCourseForEditor(numericCourseId),
		enabled: !!numericCourseId,
	});

	useEffect(() => {
		if (query.data) {
			setCourse(query.data);
		}
	}, [query.data, setCourse]);

	return query;
}

export function useCourseLearnQuery(courseId) {
	const numericCourseId = Number(courseId);

	return useQuery({
		queryKey: ["course", numericCourseId, "learn"],
		queryFn: () => courseApi.getCourseForLearning(numericCourseId),
		enabled: !!numericCourseId,
	});
}

export function useEnrolledCourses() {
	const { user } = useAuth();

	return useQuery({
		queryKey: ["courses", "enrolled", user?.id],
		queryFn: courseApi.getEnrolledCourses,
		enabled: !!user,
	});
}

export function useMyCourses() {
	const { user } = useAuth();

	return useQuery({
		queryKey: ["courses", "my-courses", user?.id],
		queryFn: courseApi.getMyCourses,
		enabled: !!user,
	});
}
