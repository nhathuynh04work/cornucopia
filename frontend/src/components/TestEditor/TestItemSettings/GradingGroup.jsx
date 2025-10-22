import ItemIndex from "../ItemList/ItemIndex";

export default function GradingGroup({ currentItem }) {
	const questions = currentItem.children;

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
