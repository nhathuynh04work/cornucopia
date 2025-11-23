import { Plus } from "lucide-react";
import CardInputItem from "./CardInputItem";

function CardInputList({ fields, remove, append }) {
	const handleAddCard = () => {
		append({
			id: `temp-${Date.now()}`,
			term: "",
			definition: "",
		});
	};

	const canDelete = fields.length > 2;

	return (
		<div className="space-y-6">
			{fields.map((field, index) => (
				<CardInputItem
					key={field._fieldId}
					index={index}
					onDelete={() => remove(index)}
					canDelete={canDelete}
				/>
			))}

			<button
				onClick={handleAddCard}
				className="w-full mt-8 py-8 border-2 border-dashed border-purple-200 rounded-2xl flex flex-col items-center justify-center text-purple-400 hover:text-purple-600 hover:border-purple-400 hover:bg-purple-50/50 transition-all group font-bold bg-white">
				<div className="w-12 h-12 bg-purple-50 group-hover:bg-purple-100 rounded-full flex items-center justify-center mb-3 transition-colors border border-purple-100 group-hover:border-purple-300">
					<Plus className="w-6 h-6 text-purple-500 group-hover:text-purple-700" />
				</div>
				<span className="group-hover:text-purple-700">
					+ Thêm thẻ mới
				</span>
			</button>
		</div>
	);
}

export default CardInputList;
