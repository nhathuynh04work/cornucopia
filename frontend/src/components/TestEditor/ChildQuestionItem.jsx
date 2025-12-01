import { useFormContext, useWatch, Controller } from "react-hook-form";
import {
	Trash2,
	CheckCircle2,
	ListChecks,
	FileText,
	AlertCircle,
} from "lucide-react";
import SimpleRichTextEditor from "@/components/Shared/SimpleRichTextEditor";
import AnswerOptionsEditor from "./AnswerOptionsEditor";

const QUESTION_TYPES = {
	MULTIPLE_CHOICE: {
		label: "Trắc nghiệm",
		icon: ListChecks,
		color: "text-purple-600",
		bg: "bg-purple-50",
	},
	SHORT_ANSWER: {
		label: "Điền từ",
		icon: FileText,
		color: "text-blue-600",
		bg: "bg-blue-50",
	},
};

export default function ChildQuestionItem({
	parentIndex,
	index,
	remove,
	questionNumber,
}) {
	const { control, register } = useFormContext();

	const selfPath = `items.${parentIndex}.children.${index}`;

	const type = useWatch({
		control,
		name: `${selfPath}.type`,
	});

	return (
		<div className="relative group/child py-6 border-b border-gray-100 last:border-0">
			{/* Actions (Absolute top-right) */}
			<div className="absolute top-6 right-0 opacity-0 group-hover/child:opacity-100 transition-opacity z-10">
				<button
					type="button"
					onClick={() => remove(index)}
					className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors">
					<Trash2 className="w-4 h-4" />
				</button>
			</div>

			{/* Header: Type & Points */}
			<div className="flex items-center gap-3 mb-3">
				<div className="flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full text-xs font-bold text-gray-500">
					{questionNumber}
				</div>
				<div
					className={`text-[10px] font-bold uppercase tracking-wider ${QUESTION_TYPES[type]?.color}`}>
					{QUESTION_TYPES[type]?.label}
				</div>
				<div className="h-3 w-px bg-gray-200" />
				<div className="flex items-center gap-1">
					<input
						type="number"
						className="w-8 text-xs font-bold text-gray-900 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-purple-500 text-right outline-none transition-colors p-0"
						{...register(`${selfPath}.points`, {
							valueAsNumber: true,
						})}
					/>
					<span className="text-[10px] text-gray-400">điểm</span>
				</div>
			</div>

			{/* Content */}
			<div className="pl-9">
				<Controller
					control={control}
					name={`${selfPath}.text`}
					rules={{ required: true }}
					render={({ field: { value, onChange } }) => (
						<SimpleRichTextEditor
							value={value}
							onChange={(val) => onChange(val)}
							placeholder="Nhập câu hỏi con..."
							className="min-h-[3rem]"
						/>
					)}
				/>

				{/* CONSISTENT SHORT ANSWER UI */}
				{type === "SHORT_ANSWER" && (
					<div className="space-y-3 mt-4">
						<label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
							Đáp án chính xác
						</label>
						<div className="relative">
							<input
								type="text"
								className="w-full pl-4 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 transition-all font-medium"
								placeholder="Nhập đáp án..."
								{...register(`${selfPath}.answer`)}
							/>
							<CheckCircle2 className="w-5 h-5 text-green-500 absolute right-3 top-3" />
						</div>
						<p className="text-xs text-gray-400 flex items-center gap-1">
							<AlertCircle className="w-3 h-3" />
							Đáp án sẽ được so sánh không phân biệt hoa thường.
						</p>
					</div>
				)}

				{/* CONSISTENT MULTIPLE CHOICE UI */}
				{type === "MULTIPLE_CHOICE" && (
					<AnswerOptionsEditor baseName={selfPath} />
				)}
			</div>
		</div>
	);
}
