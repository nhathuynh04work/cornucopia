import { useFormContext, useFieldArray } from "react-hook-form";
import { FolderOpen, Plus, X } from "lucide-react";
import ChildQuestionItem from "./ChildQuestionItem";
import MediaSection from "./MediaSection";

export default function GroupEditor({ nestIndex }) {
    const { control, register } = useFormContext();
    
    const { fields, append, remove } = useFieldArray({
        control,
        name: `items.${nestIndex}.children`
    });

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden p-6 md:p-8 space-y-8">
            
            {/* Group Header */}
            <div className="flex items-center gap-2 text-orange-800">
                <FolderOpen className="w-4 h-4" />
                <h3 className="text-xs font-bold uppercase tracking-wider">Nhóm câu hỏi (Tài nguyên chung)</h3>
            </div>

            {/* Prompt & Media */}
            <div className="space-y-4">
                <textarea
                    {...register(`items.${nestIndex}.text`)}
                    placeholder="Nhập đoạn văn, hướng dẫn hoặc chủ đề chung cho nhóm câu hỏi này..."
                    className="w-full text-xl md:text-2xl font-medium text-gray-900 placeholder:text-gray-300 border-none focus:ring-0 p-0 bg-transparent resize-none min-h-[3rem]"
                />

                {/* Group Media Section (Extracted) */}
                <MediaSection nestIndex={nestIndex} />
            </div>

            <hr className="border-gray-100" />

            {/* Child Questions List */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <h3 className="text-sm font-bold text-gray-900">Các câu hỏi trong nhóm ({fields.length})</h3>
                    <div className="flex gap-2">
                        <button 
                            type="button"
                            onClick={() => append({ type: "MULTIPLE_CHOICE", text: "", points: 1, answerOptions: [{text:"", isCorrect:false}] })}
                            className="px-3 py-1.5 bg-white border border-gray-200 hover:border-purple-300 text-gray-600 hover:text-purple-600 rounded-lg text-xs font-bold transition-all shadow-sm"
                        >
                            + Trắc nghiệm
                        </button>
                        <button 
                            type="button"
                            onClick={() => append({ type: "SHORT_ANSWER", text: "", points: 1, answer: "" })}
                            className="px-3 py-1.5 bg-white border border-gray-200 hover:border-blue-300 text-gray-600 hover:text-blue-600 rounded-lg text-xs font-bold transition-all shadow-sm"
                        >
                            + Điền từ
                        </button>
                    </div>
                </div>

                <div className="grid gap-4">
                    {fields.map((child, k) => (
                        <ChildQuestionItem 
                            key={child.id}
                            parentIndex={nestIndex}
                            index={k}
                            remove={remove}
                        />
                    ))}
                    
                    {fields.length === 0 && (
                        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                            <p className="text-sm text-gray-400">Chưa có câu hỏi nào trong nhóm này.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}