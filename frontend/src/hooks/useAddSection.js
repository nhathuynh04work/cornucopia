import { useMutation } from "@tanstack/react-query";
import { useTestEditorStore } from "../store/testEditorStore";
import { addSection } from "../apis/sectionApi";

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
