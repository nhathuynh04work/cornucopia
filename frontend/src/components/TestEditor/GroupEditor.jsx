import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import { FolderOpen } from "lucide-react";
import ChildQuestionItem from "./ChildQuestionItem";
import MediaSection from "./MediaSection";
import SimpleRichTextEditor from "@/components/Shared/SimpleRichTextEditor";

export default function GroupEditor({ nestIndex, groupNumbering }) {
	const { control } = useFormContext();

	const { fields, append, remove } = useFieldArray({
		control,
		name: `items.${nestIndex}.children`,
	});

	const startNumber = groupNumbering?.start || 1;

	return (
		<div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
			{/* 1. Group Stimulus Area */}
			<div className="p-6 md:p-8 bg-orange-50/30 space-y-4 border-b border-gray-100">
				<div className="flex items-center gap-2 text-orange-800">
					<FolderOpen className="w-4 h-4" />
					<h3 className="text-xs font-bold uppercase tracking-wider">
						Tài nguyên chung
					</h3>
				</div>

				<Controller
					control={control}
					name={`items.${nestIndex}.text`}
					render={({ field: { value, onChange } }) => (
						<SimpleRichTextEditor
							value={value}
							onChange={(val) => onChange(val)}
							placeholder="Nhập đoạn văn, hướng dẫn hoặc chủ đề chung..."
						/>
					)}
				/>

				<MediaSection nestIndex={nestIndex} />
			</div>

			{/* 2. Child Questions List - Flattened Layout */}
			<div className="p-6 md:p-8 pt-2">
				<div className="flex items-center justify-between mb-4 pt-4">
					<h3 className="text-sm font-bold text-gray-900">
						Câu hỏi ({fields.length})
					</h3>
					<div className="flex gap-2">
						<button
							type="button"
							onClick={() =>
								append({
									type: "MULTIPLE_CHOICE",
									text: "",
									points: 1,
									answerOptions: [
										{ text: "", isCorrect: false },
									],
								})
							}
							className="px-3 py-1.5 text-xs font-bold text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition-all">
							+ Trắc nghiệm
						</button>
						<button
							type="button"
							onClick={() =>
								append({
									type: "SHORT_ANSWER",
									text: "",
									points: 1,
									answer: "",
								})
							}
							className="px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all">
							+ Điền từ
						</button>
					</div>
				</div>

				<div className="flex flex-col">
					{fields.map((child, k) => (
						<ChildQuestionItem
							key={child.id}
							parentIndex={nestIndex}
							index={k}
							remove={remove}
							questionNumber={startNumber + k}
						/>
					))}

					{fields.length === 0 && (
						<div className="text-center py-8 border-2 border-dashed border-gray-100 rounded-xl">
							<p className="text-sm text-gray-400">
								Chưa có câu hỏi nào trong nhóm này.
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
