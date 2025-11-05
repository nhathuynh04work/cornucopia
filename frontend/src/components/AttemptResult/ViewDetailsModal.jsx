import { useMemo } from "react";
import { X } from "lucide-react";
import { itemTypeEnum } from "@/lib/item.config";
import SingleQuestionDetail from "./SingleQuestionDetail";
import MediaList from "../Media/MediaList.jsx";

function findItemOrGroup(items = [], questionId) {
	for (const item of items) {
		if (item.id === questionId) {
			return item;
		}
		if (item.type === itemTypeEnum.GROUP) {
			const foundInChildren = findItemOrGroup(item.children, questionId);
			if (foundInChildren) {
				return item;
			}
		}
	}
	return null;
}

function ViewDetailsModal({
	testMedia,
	selectedQuestionId,
	onClose,
	testItems,
	flatQuestions,
}) {
	const questionNumberMap = useMemo(() => {
		return new Map(flatQuestions.map((q, i) => [q.id, i + 1]));
	}, [flatQuestions]);

	const itemToDisplay = useMemo(() => {
		if (!selectedQuestionId) return null;
		return findItemOrGroup(testItems, selectedQuestionId);
	}, [selectedQuestionId, testItems]);

	if (!itemToDisplay) {
		return null;
	}

	const isGroup = itemToDisplay.type === itemTypeEnum.GROUP;

	return (
		// Modal Backdrop
		<div
			onClick={onClose}
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
			<div
				onClick={(e) => e.stopPropagation()}
				className="relative w-[900px] max-h-[75vh] bg-white rounded-lg shadow-xl flex flex-col">
				{/* Modal Header */}
				<div className="flex items-center justify-between p-4 border-b">
					<h3 className="text-lg font-semibold">Question Details</h3>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-gray-600">
						<X className="w-5 h-5" />
					</button>
				</div>

				{/* Modal Body */}
				<div className="flex-1 overflow-y-auto py-6">
					{/* test media + item media */}
					{testMedia.length + itemToDisplay.media.length > 0 && (
						<div className="p-6">
							<MediaList
								media={testMedia}
								isEditing={false}
								layout="list"
							/>

							<MediaList
								media={itemToDisplay.media}
								isEditing={false}
							/>
						</div>
					)}

					{/* If group, render its text and children, if not render itself */}
					{isGroup ? (
						<>
							<h2 className="font-semibold p-6 pt-0">
								{itemToDisplay.text}
							</h2>

							{/* Children */}
							<div>
								{itemToDisplay.children.map((childItem) => (
									<SingleQuestionDetail
										key={childItem.id}
										item={childItem}
										questionNumber={questionNumberMap.get(
											childItem.id
										)}
									/>
								))}
							</div>
						</>
					) : (
						<SingleQuestionDetail
							item={itemToDisplay}
							questionNumber={questionNumberMap.get(
								itemToDisplay.id
							)}
						/>
					)}
				</div>
			</div>
		</div>
	);
}

export default ViewDetailsModal;
