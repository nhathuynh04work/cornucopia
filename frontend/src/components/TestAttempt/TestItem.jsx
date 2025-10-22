import { itemTypeEnum } from "@/lib/item.config";
import QuestionRenderer from "./QuestionRenderer";

export default function TestItem({ item }) {
	if (item.type === itemTypeEnum.GROUP) {
		return (
			<div>
				<h2 className="text-lg font-bold text-gray-900">{item.text}</h2>
				<div className="mt-6 space-y-8">
					{item.children
						.slice()
						.sort((a, b) => a.sortOrder - b.sortOrder)
						.map((childQuestion) => (
							<div
								id={`question-${childQuestion.id}`}
								key={childQuestion.id}>
								<QuestionRenderer question={childQuestion} />
							</div>
						))}
				</div>
			</div>
		);
	}

	return (
		<div id={`question-${item.id}`}>
			<QuestionRenderer question={item} />
		</div>
	);
}
