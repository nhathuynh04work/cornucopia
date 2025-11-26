import { useFormContext, useWatch } from "react-hook-form";
import { FileText, ListChecks, FolderOpen, Trash2 } from "lucide-react";
import clsx from "clsx";

const QUESTION_TYPES = {
    MULTIPLE_CHOICE: { label: "Trắc nghiệm", icon: ListChecks, color: "text-purple-600", bg: "bg-purple-50" },
    SHORT_ANSWER: { label: "Điền từ", icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
    GROUP: { label: "Nhóm câu hỏi", icon: FolderOpen, color: "text-orange-600", bg: "bg-orange-50" }
};

const SidebarItem = ({ item, index, isActive, setActiveItemId, remove, questionNumberMap }) => {
    const { control } = useFormContext();
    const itemText = useWatch({
        control,
        name: `items.${index}.text`,
        defaultValue: item.text
    });

    const TypeIcon = QUESTION_TYPES[item.type]?.icon || FileText;
    const numberInfo = questionNumberMap[item.id] || { display: "-" };

    return (
        <button
            onClick={() => setActiveItemId(item.id)}
            className={clsx(
                "w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 group relative",
                isActive
                    ? "bg-purple-50 border-purple-200 ring-1 !ring-purple-100"
                    : "bg-white border-gray-200 hover:bg-gray-50"
            )}
        >
            <span className={clsx(
                "text-xs font-bold mt-1 w-8 shrink-0 text-center rounded py-0.5 transition-colors",
                isActive ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-500"
            )}>
                {numberInfo.display}
            </span>
            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <TypeIcon className={clsx("w-3 h-3", isActive ? "text-purple-700" : QUESTION_TYPES[item.type]?.color)} />
                    <span className={clsx(
                        "text-[10px] font-bold uppercase tracking-wide",
                        isActive ? "text-purple-700" : "text-gray-400"
                    )}>
                        {QUESTION_TYPES[item.type]?.label}
                    </span>
                </div>
                <p className={clsx("text-sm font-medium truncate", isActive ? "text-gray-900" : "text-gray-600")}>
                    {itemText || <span className="italic opacity-70">Chưa nhập nội dung...</span>}
                </p>
            </div>
            
            <div 
                role="button"
                onClick={(e) => { e.stopPropagation(); remove(index); }}
                className={clsx(
                    "absolute right-2 top-2 p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-all",
                    isActive ? "text-purple-400 hover:text-red-500 hover:bg-red-50" : "text-gray-300 hover:text-red-500 hover:bg-red-50"
                )}
            >
                <Trash2 className="w-3.5 h-3.5" />
            </div>
        </button>
    );
};

export default function Sidebar({ fields, append, remove, activeItemId, setActiveItemId, questionNumberMap }) {
    
    const handleAddItem = (type) => {
        const newItem = {
            // Removed manual ID, let backend or auto-increment handle it if possible,
            // but for field array keys, RHF handles it. 
            // If we need an ID for our logic:
            id: `new-${Date.now()}`, 
            type,
            text: "",
            points: 1,
            media: [],
            answerOptions: type === "MULTIPLE_CHOICE" ? [{ text: "", isCorrect: false }, { text: "", isCorrect: false }] : [],
            answer: "",
            children: type === "GROUP" ? [
                {
                    id: `child-${Date.now()}`,
                    type: "MULTIPLE_CHOICE",
                    text: "",
                    points: 1,
                    answerOptions: [{ text: "", isCorrect: false }, { text: "", isCorrect: false }]
                }
            ] : undefined
        };
        append(newItem);
        setActiveItemId(newItem.id); 
        
        setTimeout(() => {
            const sidebar = document.getElementById("sidebar-list");
            if (sidebar) sidebar.scrollTop = sidebar.scrollHeight;
        }, 100);
    };

    return (
        <aside className="w-80 bg-white border-r border-gray-200 flex flex-col shrink-0">
            <div className="p-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm z-10">
                <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Danh sách câu hỏi</h2>
            </div>

            <div id="sidebar-list" className="flex-1 overflow-y-auto p-3 space-y-2">
                <button
                    onClick={() => setActiveItemId("test-info")}
                    className={clsx(
                        "w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3",
                        activeItemId === "test-info"
                            ? "bg-purple-50 border-purple-200 shadow-sm ring-1 ring-purple-100"
                            : "bg-white border-gray-200 hover:border-purple-200 hover:shadow-sm hover:bg-gray-50/50"
                    )}
                >
                    <div className={clsx("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", 
                        activeItemId === "test-info" ? "bg-purple-100 text-purple-600" : "bg-purple-50 text-purple-400"
                    )}>
                        <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                        <p className={clsx("text-sm font-bold truncate", activeItemId === "test-info" ? "text-gray-900" : "text-gray-700")}>Thông tin chung</p>
                        <p className={clsx("text-xs truncate", activeItemId === "test-info" ? "text-purple-600" : "text-gray-500")}>Mô tả, Thời gian, Audio</p>
                    </div>
                </button>

                <hr className="border-gray-200 my-2" />

                {fields.map((item, index) => (
                    <SidebarItem 
                        key={item.fieldId}
                        item={item}
                        index={index}
                        isActive={activeItemId === item.id}
                        setActiveItemId={setActiveItemId}
                        remove={remove}
                        questionNumberMap={questionNumberMap}
                    />
                ))}
            </div>

            <div className="p-4 border-t border-gray-200 bg-white grid grid-cols-3 gap-2">
                {Object.entries(QUESTION_TYPES).map(([key, config]) => (
                    <button 
                        key={key}
                        onClick={() => handleAddItem(key)}
                        className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all text-center group"
                    >
                        <div className={`w-8 h-8 rounded-full ${config.bg} ${config.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                            <config.icon className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-bold text-gray-600 leading-tight">{config.label}</span>
                    </button>
                ))}
            </div>
        </aside>
    );
}