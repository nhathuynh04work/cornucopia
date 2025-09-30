import { useTestEditorStore } from "../store/testEditorStore";
import QuestionNavItem from "./QuestionNavItem";

function QuestionListNav() {
	const questions = useTestEditorStore((s) => s.questionsOrdered);

	return (
		<div className="ml-6 py-4">
			<p className="text-center mb-4">Question List</p>
			<div className="grid grid-cols-5 gap-2">
				{questions?.map((question, index) => (
					<QuestionNavItem key={question.id} id={question.id}>
						{index + 1}
					</QuestionNavItem>
				))}
			</div>
		</div>
	);
}

export default QuestionListNav;
