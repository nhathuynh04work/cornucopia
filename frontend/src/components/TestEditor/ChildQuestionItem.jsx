import { useFormContext, useWatch, useFieldArray } from "react-hook-form";
import { Trash2, CheckCircle2, Plus, ListChecks, FileText } from "lucide-react";
import clsx from "clsx";

const QUESTION_TYPES = {
    MULTIPLE_CHOICE: { label: "Trắc nghiệm", icon: ListChecks, color: "text-purple-600", bg: "bg-purple-50" },
    SHORT_ANSWER: { label: "Điền từ", icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
};

// --- INTERNAL COMPONENTS ---

const ChildOptionRow = ({ parentIndex, childIndex, optIndex, control, register, remove, handleToggleCorrect }) => {
    const isCorrect = useWatch({
        control,
        name: `items.${parentIndex}.children.${childIndex}.answerOptions.${optIndex}.isCorrect`
    });

    return (
        <div className="flex items-center gap-2 group/opt">
            <button
                type="button"
                onClick={() => handleToggleCorrect(optIndex)}
                className={clsx(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0",
                    isCorrect 
                        ? "bg-green-500 border-green-500 text-white" 
                        : "border-gray-300 text-transparent hover:border-green-400"
                )}
            >
                <CheckCircle2 className="w-3 h-3" />
            </button>

            <input 
                type="text"
                placeholder={`Lựa chọn ${optIndex + 1}`}
                className={clsx(
                    "flex-1 px-2 py-1.5 text-sm border rounded-md focus:outline-none transition-all",
                    isCorrect 
                        ? "border-green-200 bg-green-50/30 focus:border-green-500 text-green-900" 
                        : "border-gray-200 focus:border-purple-500"
                )}
                {...register(`items.${parentIndex}.children.${childIndex}.answerOptions.${optIndex}.text`)}
            />

            <button 
                onClick={() => remove(optIndex)}
                className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-md opacity-0 group-hover/opt:opacity-100"
            >
                <Trash2 className="w-3.5 h-3.5" />
            </button>
        </div>
    );
};

const ChildAnswerOptionsEditor = ({ parentIndex, childIndex }) => {
    const { control, register, setValue } = useFormContext();
    const { fields, append, remove } = useFieldArray({
        control,
        name: `items.${parentIndex}.children.${childIndex}.answerOptions`
    });

    const handleToggleCorrect = (index) => {
        fields.forEach((_, i) => {
            setValue(`items.${parentIndex}.children.${childIndex}.answerOptions.${i}.isCorrect`, i === index);
        });
    };

    return (
        <div className="space-y-2 mt-3">
            <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Lựa chọn</p>
            {fields.map((opt, index) => (
                <ChildOptionRow 
                    key={opt.id} 
                    optIndex={index} 
                    parentIndex={parentIndex}
                    childIndex={childIndex}
                    control={control}
                    register={register}
                    remove={remove}
                    handleToggleCorrect={handleToggleCorrect}
                />
            ))}
            <button 
                type="button"
                onClick={() => append({ text: "", isCorrect: false })}
                className="text-xs font-medium text-purple-600 hover:text-purple-700 flex items-center gap-1 mt-2"
            >
                <Plus className="w-3 h-3" /> Thêm lựa chọn
            </button>
        </div>
    );
};

export default function ChildQuestionItem({ parentIndex, index, remove }) {
    const { control, register, setValue } = useFormContext();
    
    const type = useWatch({
        control,
        name: `items.${parentIndex}.children.${index}.type`
    });

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm relative group/child">
            <div className="absolute top-4 right-4 opacity-0 group-hover/child:opacity-100 transition-opacity">
                <button onClick={() => remove(index)} className="text-gray-300 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            <div className="flex items-center gap-3 mb-3">
                <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide ${QUESTION_TYPES[type]?.bg} ${QUESTION_TYPES[type]?.color}`}>
                    {type === "MULTIPLE_CHOICE" ? "Trắc nghiệm" : "Điền từ"}
                </div>
                <div className="h-4 w-px bg-gray-200" />
                
                {/* Improved Score Input Styling */}
                <div className="flex items-center gap-2">
                    <input 
                        type="number" 
                        className="w-12 text-center font-bold text-gray-900 border border-gray-200 rounded-md py-0.5 text-xs focus:ring-2 focus:ring-purple-100 focus:border-purple-500 outline-none"
                        {...register(`items.${parentIndex}.children.${index}.points`, { valueAsNumber: true })}
                    />
                    <span className="text-[10px] text-gray-500 font-medium">điểm</span>
                </div>
            </div>

            <div className="space-y-4">
                <textarea
                    {...register(`items.${parentIndex}.children.${index}.text`, { required: true })}
                    placeholder="Nhập câu hỏi con..."
                    className="w-full text-sm font-medium text-gray-900 placeholder:text-gray-400 border-none focus:ring-0 p-0 bg-transparent resize-none min-h-[2.5rem]"
                    rows={1}
                />

                {type === "SHORT_ANSWER" && (
                    <div className="relative mt-2">
                        <input 
                            type="text" 
                            className="w-full pl-3 pr-8 py-2 bg-blue-50/50 border border-blue-100 rounded-lg text-sm text-blue-900 placeholder:text-blue-300/70 focus:outline-none focus:border-blue-300"
                            placeholder="Đáp án chính xác..."
                            {...register(`items.${parentIndex}.children.${index}.answer`)}
                        />
                        <CheckCircle2 className="w-4 h-4 text-blue-400 absolute right-3 top-2.5" />
                    </div>
                )}

                {type === "MULTIPLE_CHOICE" && (
                    <ChildAnswerOptionsEditor 
                        parentIndex={parentIndex} 
                        childIndex={index} 
                    />
                )}
            </div>
        </div>
    );
}