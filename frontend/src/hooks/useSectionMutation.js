import { useMutation } from "@tanstack/react-query";
import { useTestEditorStore } from "../store/testEditorStore";
import { addSection, deleteSection } from "../apis/sectionApi";
import toast from "react-hot-toast";

export function useAddSectionMutation(testId) {
	const updateEntities = useTestEditorStore((s) => s.updateEntities);
	const appendChildToParent = useTestEditorStore(
		(s) => s.appendChildToParent
	);

	return useMutation({
		mutationFn: () => addSection(testId),
		onSuccess: (newSection) => {
			updateEntities("testSections", newSection.id, newSection);
			appendChildToParent("tests", testId, "testSections", newSection.id);
		},
	});
}

export function useDeleteSectionMutation(sectionId) {
	const deleteEntity = useTestEditorStore((s) => s.deleteEntity);

	return useMutation({
		mutationFn: () => deleteSection(sectionId),
		onSuccess: () => {
			deleteEntity("testSections", sectionId);
			toast.success("Section deleted");
		},
	});
}
