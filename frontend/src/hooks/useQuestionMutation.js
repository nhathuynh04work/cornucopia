import { useMutation } from "@tanstack/react-query";
import { useTestEditorStore } from "../store/testEditorStore";
import {
	addOptionToQuestion,
	addSingleQuestion,
	deleteQuestion,
} from "../apis/questionApi";

export function useAddSingleQuestionMutation(sectionId, questionType) {
	const updateEntities = useTestEditorStore((s) => s.updateEntities);
	const appendChildToParent = useTestEditorStore(
		(s) => s.appendChildToParent
	);

	return useMutation({
		mutationFn: () => addSingleQuestion(sectionId, questionType),
		onSuccess: (data) => {
			const { group, question } = data;

			// Add and append group to entities
			updateEntities("questionGroups", group.id, group);
			appendChildToParent(
				"testSections",
				sectionId,
				"questionGroups",
				group.id
			);

			// Add and append question to entities
			updateEntities("questions", question.id, question);
			appendChildToParent(
				"questionGroups",
				group.id,
				"questions",
				question.id
			);
		},
	});
}

export function useAddOptionToQuestionMutation(questionId) {
	const updateEntities = useTestEditorStore((s) => s.updateEntities);
	const appendChildToParent = useTestEditorStore(
		(s) => s.appendChildToParent
	);

	return useMutation({
		mutationFn: () => addOptionToQuestion(questionId),
		onSuccess: (newOption) => {
			updateEntities("answerOptions", newOption.id, newOption);
			appendChildToParent(
				"questions",
				questionId,
				"answerOptions",
				newOption.id
			);
		},
	});
}

export function useDeleteQuestionMutation(questionId) {
	const getEntity = useTestEditorStore((s) => s.getEntity);
	const deleteEntity = useTestEditorStore((s) => s.deleteEntity);

	return useMutation({
		mutationFn: () => deleteQuestion(questionId),
		onSuccess: () => {
			// Step 1: Get the group of the question
			const question = getEntity("questions", questionId);
			const group = getEntity("questionGroups", question.groupId);

			// Step 2: Delete the question
			deleteEntity("questions", questionId);

			// Step 3: Delete the group from section if it's a single group
			if (group.isSingleGroup) {
				deleteEntity("questionGroups", group.id);
			}
		},
	});
}
