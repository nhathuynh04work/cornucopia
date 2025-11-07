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

export function usePublicCourseQuery(courseId) {
	const numericCourseId = Number(courseId);

	return useQuery({
		queryKey: ["course", numericCourseId, "public"],
		queryFn: () => courseApi.getPublicCourseDetails(numericCourseId),
		enabled: !!numericCourseId,
	});
}

export function useEnrollmentStatusQuery(courseId) {
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

	// Hydrate store when query resolves
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
