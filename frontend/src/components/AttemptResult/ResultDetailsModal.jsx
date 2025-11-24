import Modal from "@/components/Shared/Modal";
import DetailedQuestionView from "./DetailedQuestionView";

export default function ResultDetailsModal({ context, onClose }) {
	const items = context.items || [];
	const startIndex = context.startIndex || 1;

	const sortedItems = [...items].sort(
		(a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)
	);

	return (
		<Modal onClose={onClose}>
			{/* Added hide-scrollbar class */}
			<div className="max-h-[80vh] overflow-y-auto p-1 hide-scrollbar">
				<div className="mb-6 pb-4 border-b border-gray-100">
					<h3 className="text-lg font-bold text-gray-900">
						Chi tiết câu hỏi
					</h3>
				</div>

				<div className="space-y-6">
					{sortedItems.map((question, idx) => (
						<DetailedQuestionView
							key={question.id}
							question={question}
							index={startIndex + idx}
						/>
					))}
				</div>
			</div>
		</Modal>
	);
}
