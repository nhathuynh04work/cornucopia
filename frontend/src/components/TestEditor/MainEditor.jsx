import { useMemo } from "react";
import { AlertCircle } from "lucide-react";
import TestInfoEditor from "./TestInfoEditor";
import QuestionEditor from "./QuestionEditor";
import GroupEditor from "./GroupEditor";

export default function MainEditor({ activeItemId, fields }) {

    const activeIndex = useMemo(() => fields.findIndex(f => f.id === activeItemId), [fields, activeItemId]);
    const activeItem = fields[activeIndex];

    return (
        <main className="flex-1 bg-gray-100/50 overflow-y-auto p-6 md:p-10 scroll-smooth">
            <div className="max-w-3xl mx-auto pb-20">
                
                {/* 1. Test Info */}
                {activeItemId === "test-info" && (
                    <TestInfoEditor />
                )}

                {/* 2. Question Editors */}
                {activeItemId !== "test-info" && activeIndex !== -1 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                        {activeItem.type === "GROUP" ? (
                            <GroupEditor 
                                key={activeItem.id} 
                                nestIndex={activeIndex}
                            />
                        ) : (
                            <QuestionEditor 
                                key={activeItem.id} 
                                nestIndex={activeIndex}
                                item={activeItem}
                            />
                        )}
                    </div>
                )}

                {/* 3. Empty State */}
                {activeItemId !== "test-info" && activeIndex === -1 && (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 pt-20">
                        <AlertCircle className="w-12 h-12 mb-4 opacity-20" />
                        <p>Chọn một câu hỏi để chỉnh sửa</p>
                    </div>
                )}

            </div>
        </main>
    );
}