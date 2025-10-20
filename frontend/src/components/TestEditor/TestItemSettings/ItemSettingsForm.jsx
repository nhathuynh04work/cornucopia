import { useState } from "react";
import { ImageIcon } from "lucide-react";
import { itemTypeEnum } from "@/lib/item.config";
import { Section } from "./Section";
import { TypeDropdown } from "./TypeDropdown";
import ItemIndex from "../ItemList/ItemIndex";

function GradingShortAnswer({ currentItem }) {
	// This state would be replaced by react-hook-form later
	const [answer, setAnswer] = useState("");
	const [points, setPoints] = useState(currentItem.points || 1);

	return (
		<div className="space-y-2">
			{/* Answer Row */}
			<div className="flex items-center gap-4">
				<label className="text-[11px] font-medium text-gray-500 w-20">
					Answer
				</label>
				<input
					type="text"
					value={answer}
					onChange={(e) => setAnswer(e.target.value)}
					placeholder="Enter correct answer"
					className="w-full px-2 py-1 rounded-md border border-gray-300 bg-gray-50 text-xs focus:border-purple-500 focus:ring-1 focus:ring-purple-200 outline-none text-right"
				/>
			</div>
			{/* Points Row */}
			<div className="flex items-center gap-4">
				<label className="text-[11px] font-medium text-gray-500 w-20">
					Points
				</label>
				<input
					type="number"
					value={points}
					onChange={(e) => setPoints(e.target.value)}
					className="w-full px-2 py-1 rounded-md border border-gray-300 bg-gray-50 text-xs focus:border-purple-500 focus:ring-1 focus:ring-purple-200 outline-none text-right"
				/>
			</div>
		</div>
	);
}

function GradingMultipleChoice({ currentItem }) {
	const correctAnswerId = currentItem.answerOptions?.find(
		(opt) => opt.isCorrect
	)?.id;
	// This state would be replaced by react-hook-form
	const [selectedAnswer, setSelectedAnswer] = useState(correctAnswerId || "");
	const [points, setPoints] = useState(currentItem.points || 1);

	return (
		<div className="space-y-2">
			{/* Answer Row */}
			<div className="flex items-center gap-4">
				<label className="text-[11px] font-medium text-gray-500 w-20">
					Answer
				</label>
				<select
					value={selectedAnswer}
					onChange={(e) => setSelectedAnswer(e.target.value)}
					className="w-full px-2 py-1 rounded-md border border-gray-300 bg-gray-50 text-xs focus:border-purple-500 focus:ring-1 focus:ring-purple-200 outline-none text-right">
					<option value="" disabled>
						Select an answer
					</option>

					{currentItem.answerOptions?.map((option, index) => (
						<option key={option.id} value={option.id}>
							{option.text || `Option ${index + 1}`}
						</option>
					))}
				</select>
			</div>
			{/* Points Row */}
			<div className="flex items-center gap-4">
				<label className="text-[11px] font-medium text-gray-500 w-20">
					Points
				</label>
				<input
					type="number"
					value={points}
					onChange={(e) => setPoints(e.target.value)}
					className="w-full px-2 py-1 rounded-md border border-gray-300 bg-gray-50 text-xs focus:border-purple-500 focus:ring-1 focus:ring-purple-200 outline-none text-right"
				/>
			</div>
		</div>
	);
}

function GradingGroup({ currentItem }) {
	const questions = currentItem.children || [];

	if (questions.length === 0) {
		return (
			<p className="text-xs text-gray-500 italic">
				This group has no questions.
			</p>
		);
	}

	return (
		<div className="flex flex-col gap-2">
			<ul className="flex flex-col gap-2 pr-1">
				{questions.map((question) => (
					<li
						key={question.id}
						className="flex justify-between items-center border p-2 rounded-md">
						<ItemIndex item={question} />
						<div className="flex items-center gap-1.5 text-[12px]">
							<span className="font-medium text-gray-800">
								{question.points || 1}
							</span>
							<span className="text-gray-500">pts</span>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}

export default function ItemSettingsForm({ currentItem }) {
	function renderGradingSection() {
		switch (currentItem.type) {
			case itemTypeEnum.SHORT_ANSWER:
				return <GradingShortAnswer currentItem={currentItem} />;

			case itemTypeEnum.MULTIPLE_CHOICE:
				return <GradingMultipleChoice currentItem={currentItem} />;

			case itemTypeEnum.GROUP:
				return <GradingGroup currentItem={currentItem} />;

			default:
				return (
					<p className="text-xs text-gray-400 italic">
						No grading options for this item type.
					</p>
				);
		}
	}

	return (
		<>
			{/* "Type" Section */}
			<Section title="Type">
				<TypeDropdown
					currentType={currentItem.type}
					onChange={(type) => {
						console.log("Changed type to:", type);
					}}
				/>
			</Section>

			{/* "Grading" Section */}
			<Section title="Grading">{renderGradingSection()}</Section>

			{/* "Media" Section */}
			<Section title="Media">
				<div className="w-full h-32 border border-dashed !border-gray-400 rounded-lg flex flex-col gap-1 items-center justify-center text-gray-500 hover:!border-purple-500 hover:text-purple-600 transition cursor-pointer">
					<ImageIcon className="w-8 h-8" strokeWidth={1} />
					<span className="text-[10px] font-medium mt-1">
						Add Media
					</span>
				</div>
			</Section>
		</>
	);
}
