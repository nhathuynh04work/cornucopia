import { useFormContext, Controller } from "react-hook-form";
import {
	ListChecks,
	FileText,
	Image as ImageIcon,
	X,
	AlertCircle,
	CheckCircle2,
} from "lucide-react";
import MediaUploader from "@/components/Shared/MediaUploader";
import AnswerOptionsEditor from "./AnswerOptionsEditor";
import MediaSection from "./MediaSection";
import SimpleRichTextEditor from "@/components/Shared/SimpleRichTextEditor";

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

export default function QuestionEditor({ nestIndex, item }) {
	const { register, control } = useFormContext();
	const Icon = QUESTION_TYPES[item.type]?.icon || FileText;

	return (
		<div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
			<div className="p-6 md:p-8 space-y-6">
				{/* Header */}
				<div className="flex items-center justify-between">
					<div
						className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
							QUESTION_TYPES[item.type]?.bg
						} ${QUESTION_TYPES[item.type]?.color}`}>
						<Icon className="w-3.5 h-3.5" />
						{QUESTION_TYPES[item.type]?.label}
					</div>

					<div className="flex items-center gap-2">
						<label className="text-sm font-medium text-gray-500">
							Điểm số:
						</label>
						<input
							type="number"
							className="w-16 text-center font-bold text-gray-900 border border-gray-200 rounded-lg py-1 focus:ring-2 focus:ring-purple-100 focus:border-purple-500 outline-none"
							{...register(`items.${nestIndex}.points`, {
								valueAsNumber: true,
							})}
						/>
					</div>
				</div>

				{/* Content - Rich Text Editor */}
				<div>
					<Controller
						control={control}
						name={`items.${nestIndex}.text`}
						rules={{ required: true }}
						render={({ field: { value, onChange } }) => (
							<SimpleRichTextEditor
								value={value}
								onChange={(val) => onChange(val)}
								placeholder="Nhập nội dung câu hỏi..."
							/>
						)}
					/>
				</div>

				{/* Media Section (Extracted) */}
				<MediaSection nestIndex={nestIndex} />

				<hr className="border-gray-100" />

				{item.type === "MULTIPLE_CHOICE" && (
					<AnswerOptionsEditor nestIndex={nestIndex} />
				)}

				{item.type === "SHORT_ANSWER" && (
					<div className="space-y-3">
						<label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
							Đáp án chính xác
						</label>
						<div className="relative">
							<input
								type="text"
								className="w-full pl-4 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 transition-all font-medium"
								placeholder="Nhập đáp án..."
								{...register(`items.${nestIndex}.answer`)}
							/>
							<CheckCircle2 className="w-5 h-5 text-green-500 absolute right-3 top-3" />
						</div>
						<p className="text-xs text-gray-400 flex items-center gap-1">
							<AlertCircle className="w-3 h-3" />
							Đáp án sẽ được so sánh không phân biệt hoa thường.
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
