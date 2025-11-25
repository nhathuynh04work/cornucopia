import { Sparkles, BookOpen } from "lucide-react";
import CitationChip from "./CitationChip";

export default function ChatMessage({ message }) {
    const isUser = message.role === "user";

    return (
        <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"} mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`
                max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm relative
                ${isUser 
                    ? "bg-purple-600 text-white rounded-br-sm" 
                    : "bg-white border border-gray-100 text-gray-800 rounded-bl-sm"}
            `}>
                {!isUser && (
                    <div className="absolute -left-2 -top-2 bg-purple-50 p-1 rounded-full border border-white shadow-sm">
                        <Sparkles className="w-3 h-3 text-purple-600" />
                    </div>
                )}

                <div className="whitespace-pre-wrap break-words">
                    {message.content}
                </div>

                {!isUser && message.citations && message.citations.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                            <BookOpen className="w-3 h-3" /> Nguồn tham khảo
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {message.citations.map((cit, idx) => (
                                <CitationChip key={idx} citation={cit} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}