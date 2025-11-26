import { useState } from "react";
import ResultItemRow from "./ResultItemRow";
import ResultDetailsModal from "./ResultDetailsModal";
import { flattenTestItems } from "@/lib/testHelpers";

export default function QuestionResultList({ items }) {
	const [selectedContext, setSelectedContext] = useState(null);

	if (!items || items.length === 0) return null;

	const { flatQuestions } = flattenTestItems(items);

	const handleItemClick = (item) => {
		if (!item.parentItemId) {
			setSelectedContext({
				type: "single",
				items: [item],
				startIndex:
					flatQuestions.findIndex((q) => q.id === item.id) + 1,
			});
			return;
		}

		const parentGroup = items.find((i) => i.id === item.parentItemId);

		if (!parentGroup) return;

		setSelectedContext({
			type: "group",
			items: parentGroup.children,
			startIndex:
				flatQuestions.findIndex(
					(q) => q.id === parentGroup.children[0].id
				) + 1,
		});
	};

	return (
		<>
			{/* Scrollable Container - hide-scrollbar class added */}
			<div className="h-full w-full overflow-y-auto hide-scrollbar">
				<div className="divide-y divide-gray-100">
					{flatQuestions.map((item, index) => (
						<ResultItemRow
							key={item.id}
							item={item}
							index={index + 1}
							onClick={() => handleItemClick(item)}
						/>
					))}
				</div>
			</div>

			{/* Details Modal */}
			{selectedContext && (
				<ResultDetailsModal
					context={selectedContext}
					onClose={() => setSelectedContext(null)}
				/>
			)}
		</>
	);
}
