import { useMutation } from "@tanstack/react-query";
import {
	addNormalGroup,
	addQuestionToGroup,
	deleteGroup,
} from "../apis/questionGroupApi";
import { useTestEditorStore } from "../store/testEditorStore";
import toast from "react-hot-toast";

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

export function useDeleteGroupMutation(groupId) {
	const deleteEntity = useTestEditorStore((s) => s.deleteEntity);

	return useMutation({
		mutationFn: () => deleteGroup(groupId),
		onSuccess: () => {
			deleteEntity("questionGroups", groupId);

			toast.success("Group deleted");
		},
	});
}
