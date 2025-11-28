import { useState, useRef, useEffect, useMemo } from "react";
import {
	useUpdateCourse,
	useModuleMutations,
	useLessonMutations,
} from "@/hooks/useCourseMutation";
import { debounce } from "lodash";

export function useCourseEditor(initialData) {
	const [course, setCourse] = useState(initialData);
	const [isSaving, setIsSaving] = useState(false);
	const [lastSaved, setLastSaved] = useState(new Date(initialData.updatedAt));

	const { mutate: updateCourse } = useUpdateCourse();
	const { addModule, updateModule, deleteModule } = useModuleMutations();
	const { addLesson, updateLesson, deleteLesson } = useLessonMutations();

	const mutationsRef = useRef({ updateCourse, updateModule, updateLesson });
	useEffect(() => {
		mutationsRef.current = { updateCourse, updateModule, updateLesson };
	}, [updateCourse, updateModule, updateLesson]);

	const debouncedSave = useMemo(
		() => ({
			courseInfo: debounce((id, data) => {
				setIsSaving(true);
				mutationsRef.current.updateCourse(
					{ id, data },
					{
						onSuccess: () => {
							setIsSaving(false);
							setLastSaved(new Date());
						},
						onError: () => setIsSaving(false),
					}
				);
			}, 1000),
			module: debounce((moduleId, courseId, data) => {
				setIsSaving(true);
				mutationsRef.current.updateModule.mutate(
					{ moduleId, courseId, data },
					{
						onSettled: () => {
							setIsSaving(false);
							setLastSaved(new Date());
						},
					}
				);
			}, 1000),
			lesson: debounce((lessonId, moduleId, courseId, data) => {
				setIsSaving(true);
				mutationsRef.current.updateLesson.mutate(
					{ lessonId, moduleId, courseId, data },
					{
						onSettled: () => {
							setIsSaving(false);
							setLastSaved(new Date());
						},
					}
				);
			}, 1000),
		}),
		[]
	);

	useEffect(() => {
		return () => {
			debouncedSave.courseInfo.cancel();
			debouncedSave.module.cancel();
			debouncedSave.lesson.cancel();
		};
	}, [debouncedSave]);

	const handleUpdateCourseInfo = (field, value) => {
		setCourse((prev) => ({ ...prev, [field]: value }));
		debouncedSave.courseInfo(course.id, { [field]: value });
	};

	const handleUpdateModule = (moduleId, field, value) => {
		setCourse((prev) => ({
			...prev,
			modules: prev.modules.map((m) =>
				m.id === moduleId ? { ...m, [field]: value } : m
			),
		}));
		debouncedSave.module(moduleId, course.id, { [field]: value });
	};

	const handleUpdateLesson = (lessonId, updates) => {
		setCourse((prev) => ({
			...prev,
			modules: prev.modules.map((m) => ({
				...m,
				lessons: m.lessons.map((l) =>
					l.id === lessonId ? { ...l, ...updates } : l
				),
			})),
		}));
		const moduleId = course.modules.find((m) =>
			m.lessons.some((l) => l.id === lessonId)
		)?.id;
		if (moduleId)
			debouncedSave.lesson(lessonId, moduleId, course.id, updates);
	};

	const handleAddModule = () => {
		setIsSaving(true);
		const title = `Chương mới ${course.modules.length + 1}`;
		addModule.mutate(
			{ courseId: course.id, title },
			{
				onSuccess: (newModule) => {
					setCourse((prev) => ({
						...prev,
						modules: [
							...(prev.modules || []),
							{ ...newModule, lessons: [] },
						],
					}));
				},
				onSettled: () => setIsSaving(false),
			}
		);
	};

	return {
		course,
		setCourse,
		isSaving,
		setIsSaving,
		lastSaved,
		setLastSaved,
		handlers: {
			updateCourseInfo: handleUpdateCourseInfo,
			updateModule: handleUpdateModule,
			updateLesson: handleUpdateLesson,
			addModule: handleAddModule,
		},
		mutations: {
			addLesson,
			deleteModule,
			deleteLesson,
			updateCourse,
		},
	};
}
