import { useFieldArray, useWatch, useFormContext } from "react-hook-form";
import { CheckCircle2, Trash2, Plus } from "lucide-react";
import clsx from "clsx";

const AnswerOptionRow = ({
	nestIndex,
	index,
	register,
	remove,
	handleToggleCorrect,
	control,
}) => {
	const isCorrect = useWatch({
		control,
		name: `items.${nestIndex}.answerOptions.${index}.isCorrect`,
	});

	return (
		<div className="flex items-center gap-3 group/opt">
			<button
				type="button"
				onClick={() => handleToggleCorrect(index)}
				className={clsx(
					"w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0",
					isCorrect
						? "bg-green-500 border-green-500 text-white"
						: "border-gray-300 text-transparent hover:border-green-400"
				)}
				title={isCorrect ? "Đáp án đúng" : "Đánh dấu là đúng"}>
				<CheckCircle2 className="w-4 h-4" />
			</button>

			<input
				type="text"
				placeholder={`Lựa chọn ${index + 1}`}
				className={clsx(
					"flex-1 px-3 py-2 text-sm border rounded-lg focus:outline-none transition-all",
					isCorrect
						? "border-green-200 bg-green-50/30 focus:border-green-500 text-green-900 font-medium"
						: "border-gray-200 focus:border-purple-500"
				)}
				{...register(`items.${nestIndex}.answerOptions.${index}.text`)}
			/>

			<button
				onClick={() => remove(index)}
				className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover/opt:opacity-100">
				<Trash2 className="w-4 h-4" />
			</button>
		</div>
	);
};

export default function AnswerOptionsEditor({ nestIndex }) {
	const { control, register, setValue } = useFormContext();
	const { fields, append, remove } = useFieldArray({
		control,
		name: `items.${nestIndex}.answerOptions`,
	});

	const handleToggleCorrect = (index) => {
		fields.forEach((_, i) => {
			// Mark as dirty when toggling correct answer
			setValue(
				`items.${nestIndex}.answerOptions.${i}.isCorrect`,
				i === index,
				{ shouldDirty: true }
			);
		});
	};

	return (
		<div className="space-y-3 mt-4">
			<div className="flex items-center justify-between mb-2">
				<p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
					Các lựa chọn
				</p>
			</div>

			<div className="space-y-2">
				{fields.map((opt, index) => (
					<AnswerOptionRow
						key={opt.id}
						nestIndex={nestIndex}
						index={index}
						control={control}
						register={register}
						remove={remove}
						handleToggleCorrect={handleToggleCorrect}
					/>
				))}
			</div>

			<button
				type="button"
				onClick={() => append({ text: "", isCorrect: false })}
				className="text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 px-3 py-2 rounded-lg transition-colors flex items-center gap-2 mt-2">
				<Plus className="w-4 h-4" /> Thêm lựa chọn
			</button>
		</div>
	);
}
