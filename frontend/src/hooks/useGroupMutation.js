import { useMutation } from "@tanstack/react-query";
import { addNormalGroup, addQuestionToGroup } from "../apis/questionGroupApi";
import { useTestEditorStore } from "../store/testEditorStore";

export function useAddNormalQuestionGroupMutation(sectionId) {
	const updateEntities = useTestEditorStore((s) => s.updateEntities);
	const appendChildToParent = useTestEditorStore(
		(s) => s.appendChildToParent
	);

	return useMutation({
		mutationFn: () => addNormalGroup(sectionId),
		onSuccess: (newGroup) => {
			updateEntities("questionGroups", newGroup.id, newGroup);
			appendChildToParent(
				"testSections",
				sectionId,
				"questionGroups",
				newGroup.id
			);
		},
	});
}

export function useAddQuestionToGroupMutation(groupId, questionType) {
	const updateEntities = useTestEditorStore((s) => s.updateEntities);
	const appendChildToParent = useTestEditorStore(
		(s) => s.appendChildToParent
	);

	return useMutation({
		mutationFn: () => addQuestionToGroup(groupId, questionType),
		onSuccess: (newQuestion) => {
			updateEntities("questions", newQuestion.id, newQuestion);
			appendChildToParent(
				"questionGroups",
				newQuestion.groupId,
				"questions",
				newQuestion.id
			);
		},
	});
}
