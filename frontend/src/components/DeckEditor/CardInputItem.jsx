import { useRef } from "react";
import { Trash2 } from "lucide-react";
import { useFormContext } from "react-hook-form";

function CardInputItem({ index, onDelete, canDelete }) {
	const { register, setValue, getValues } = useFormContext();

	const termFieldName = `cards.${index}.term`;
	const lastValidTerm = useRef(getValues(termFieldName) || "");

	const termRegister = register(termFieldName);

	const cardInputStyle =
		"w-full p-4 text-base rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 outline-none ring-0 focus:bg-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-none leading-relaxed";

	return (
		<div className="group bg-gray-50 rounded-2xl border border-gray-200 hover:border-purple-400 transition-all duration-200 overflow-hidden">
			<div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
				<span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-700 text-sm font-bold border border-purple-200">
					{index + 1}
				</span>
				<button
					onClick={onDelete}
					disabled={!canDelete}
					className={`p-2 rounded-lg transition-colors ${
						!canDelete
							? "text-gray-300 cursor-not-allowed bg-transparent"
							: "text-gray-400 hover:text-red-500 hover:bg-red-50"
					}`}
					title={!canDelete ? "Cần tối thiểu 2 thẻ" : "Xóa thẻ"}>
					<Trash2 className="w-4 h-4" />
				</button>
			</div>

			<div className="p-6 grid md:grid-cols-2 gap-8">
				{/* Term Input */}
				<div className="space-y-2">
					<label className="block text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
						Thuật ngữ
					</label>
					<textarea
						{...termRegister}
						onBlur={(e) => {
							termRegister.onBlur(e);
							const currentValue = e.target.value;
							if (currentValue.trim()) {
								lastValidTerm.current = currentValue;
								return;
							}
							setValue(termFieldName, lastValidTerm.current);
						}}
						rows={2}
						className={cardInputStyle}
						placeholder="Nhập thuật ngữ..."
					/>
				</div>

				{/* Definition Input */}
				<div className="space-y-2">
					<label className="block text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
						Định nghĩa
					</label>
					<textarea
						{...register(`cards.${index}.definition`)}
						rows={2}
						className={cardInputStyle}
						placeholder="Nhập định nghĩa..."
					/>
				</div>
			</div>
		</div>
	);
}

export default CardInputItem;
