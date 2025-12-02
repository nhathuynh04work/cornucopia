import { useState, useMemo } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import CourseInfoEditor from "./CourseInfoEditor";
import ModuleView from "./ModuleView";
import ConfirmationModal from "@/components/Shared/ConfirmationModal";
import { useConfirmation } from "@/hooks/useConfirmation";
import { useCourseEditor } from "@/hooks/useCourseEditor";
import { getLessonIndexMap } from "@/lib/utils/course";
import { useQueryClient } from "@tanstack/react-query";
import courseApi from "@/apis/courseApi";
import toast from "react-hot-toast";

export default function CourseEditor({ initialData }) {
	const [activeItemId, setActiveItemId] = useState("course-info");
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const queryClient = useQueryClient();

	const {
		course,
		setCourse,
		isSaving,
		setIsSaving,
		lastSaved,
		handlers,
		mutations,
	} = useCourseEditor(initialData);

	const {
		confirmationState,
		requestConfirmation,
		close: closeConfirm,
		confirm: executeConfirm,
	} = useConfirmation();

	const handleAddLesson = (moduleId) => {
		setIsSaving(true);
		mutations.addLesson.mutate(
			{
				moduleId,
				courseId: course.id,
				title: "Bài học mới",
				type: "VIDEO",
			},
			{
				onSuccess: (newLesson) => {
					setCourse((prev) => ({
						...prev,
						modules: prev.modules.map((m) =>
							m.id === moduleId
								? {
										...m,
										lessons: [
											...(m.lessons || []),
											newLesson,
										],
								  }
								: m
						),
					}));
					setActiveItemId(`lesson-${newLesson.id}`);
				},
				onSettled: () => setIsSaving(false),
			}
		);
	};

	const handleDeleteModule = (moduleId) => {
		requestConfirmation({
			title: "Xóa chương này?",
			message: "Hành động này không thể hoàn tác.",
			data: { action: "DELETE_MODULE", id: moduleId },
		}).then((confirmed) => {
			if (confirmed) {
				if (activeViewData?.module?.id === moduleId)
					setActiveItemId("course-info");

				setCourse((prev) => ({
					...prev,
					modules: prev.modules.filter((m) => m.id !== moduleId),
				}));
				mutations.deleteModule.mutate({
					moduleId,
					courseId: course.id,
				});
			}
		});
	};

	const handleDeleteLesson = (lessonId) => {
		requestConfirmation({
			title: "Xóa bài học?",
			message: "Hành động này không thể hoàn tác.",
		}).then((confirmed) => {
			if (confirmed) {
				const moduleId = course.modules.find((m) =>
					m.lessons.some((l) => l.id === lessonId)
				)?.id;

				if (activeItemId === `lesson-${lessonId}` && moduleId)
					setActiveItemId(`module-${moduleId}`);

				setCourse((prev) => ({
					...prev,
					modules: prev.modules.map((m) => ({
						...m,
						lessons: m.lessons.filter((l) => l.id !== lessonId),
					})),
				}));
				if (moduleId)
					mutations.deleteLesson.mutate({
						lessonId,
						moduleId,
						courseId: course.id,
					});
			}
		});
	};

	const handleUpdateCourseStatus = (newStatus) => {
		const performUpdate = () => {
			setIsSaving(true);
			mutations.updateCourse(
				{ id: course.id, data: { status: newStatus } },
				{
					onSuccess: async () => {
						try {
							await queryClient.invalidateQueries({
								queryKey: ["course", Number(course.id), "edit"],
							});
							const freshCourseData =
								await courseApi.getForEditor(course.id);
							setCourse(freshCourseData);
							toast.success(
								"Khoá học và toàn bộ bài giảng đều được công khai."
							);
						} catch {
							toast.error("Công khai khoá học thất bại");
						} finally {
							setIsSaving(false);
						}
					},
					onError: () => {
						setIsSaving(false);
					},
				}
			);
		};

		if (course.status === "DRAFT" && newStatus === "PUBLIC") {
			requestConfirmation({
				title: "Xuất bản khóa học?",
				message:
					"Khóa học sẽ được công khai cho học viên. Bạn có chắc chắn muốn tiếp tục?",
			}).then((confirmed) => {
				if (confirmed) performUpdate();
			});
		} else {
			performUpdate();
		}
	};

	const lessonMap = useMemo(
		() => getLessonIndexMap(course?.modules),
		[course?.modules]
	);

	const activeViewData = useMemo(() => {
		if (!course || activeItemId === "course-info") return { type: "INFO" };
		if (activeItemId.startsWith("module-")) {
			const modId = parseInt(activeItemId.split("-")[1]);
			const mod = course.modules?.find((m) => m.id === modId);
			const index = course.modules?.findIndex((m) => m.id === modId) + 1;
			return mod ? { type: "MODULE", module: mod, index } : null;
		}
		if (activeItemId.startsWith("lesson-")) {
			const lessonId = parseInt(activeItemId.split("-")[1]);
			const module = course.modules.find((m) =>
				m.lessons.some((l) => l.id === lessonId)
			);
			const index =
				course.modules.findIndex((m) => m.id === module?.id) + 1;
			return module ? { type: "MODULE", module, index } : null;
		}
		return null;
	}, [activeItemId, course]);

	return (
		<div className="h-screen flex flex-col bg-white font-sans text-gray-900 overflow-hidden">
			<Header
				course={course}
				isSaving={isSaving}
				lastSaved={lastSaved}
				onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
				onStatusChange={handleUpdateCourseStatus}
			/>
			<div className="flex-1 flex overflow-hidden">
				<Sidebar
					course={course}
					activeItemId={activeItemId}
					onSelect={setActiveItemId}
					onAddModule={handlers.addModule}
					onAddLesson={handleAddLesson}
					onDeleteModule={handleDeleteModule}
					onDeleteLesson={handleDeleteLesson}
					isOpen={isSidebarOpen}
					onClose={() => setIsSidebarOpen(false)}
				/>
				<main className="flex-1 bg-gray-50 overflow-y-auto p-4 md:p-8 relative scroll-smooth">
					{activeViewData?.type === "INFO" && (
						<CourseInfoEditor
							course={course}
							onChange={handlers.updateCourseInfo}
						/>
					)}
					{activeViewData?.type === "MODULE" && (
						<ModuleView
							module={activeViewData.module}
							index={activeViewData.index}
							courseStatus={course.status}
							lessonMap={lessonMap}
							activeItemId={activeItemId}
							onUpdateModule={(field, val) =>
								handlers.updateModule(
									activeViewData.module.id,
									field,
									val
								)
							}
							onUpdateLesson={handlers.updateLesson}
							onDeleteLesson={handleDeleteLesson}
							onAddLesson={handleAddLesson}
						/>
					)}
				</main>
			</div>
			{confirmationState.isOpen && (
				<ConfirmationModal
					isOpen={confirmationState.isOpen}
					onClose={closeConfirm}
					onCancel={closeConfirm}
					onConfirm={executeConfirm}
					{...confirmationState}>
					<p>{confirmationState.message}</p>
				</ConfirmationModal>
			)}
		</div>
	);
}
