import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Square } from "lucide-react";
import ChatMessage from "./ChatMessage";
import { api } from "@/apis/axios";

const sendMessage = async (query, signal) => {
	const { data } = await api.post(
		`/chatbot`,
		{ question: query },
		{ signal }
	);

	return {
		content: data.answer,
		citations: data.citations,
	};
};

export default function ChatWindow({ className }) {
	const [inputValue, setInputValue] = useState("");
	const [isGenerating, setIsGenerating] = useState(false);
	const [messages, setMessages] = useState([
		{
			id: "init-1",
			role: "bot",
			content:
				"Xin chào! Tôi là trợ lý AI của bạn. Bạn cần giúp gì về các khóa học hay bộ thẻ hôm nay?",
			citations: [],
		},
	]);

	const scrollRef = useRef(null);
	const abortControllerRef = useRef(null);
	const inputRef = useRef(null);

	// Auto-scroll
	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
		}
	}, [messages, isGenerating]);

	// Auto-focus
	useEffect(() => {
		if (!isGenerating && inputRef.current) {
			inputRef.current.focus();
		}
	}, [isGenerating]);

	const handleSend = async (e) => {
		e.preventDefault();
		if (!inputValue.trim() || isGenerating) return;

		const userText = inputValue;
		setInputValue("");
		setIsGenerating(true);

		// Add User Message
		const userMsg = {
			id: Date.now(),
			role: "user",
			content: userText,
			citations: [],
		};
		setMessages((prev) => [...prev, userMsg]);

		// Init AbortController
		abortControllerRef.current = new AbortController();

		try {
			const response = await sendMessage(
				userText,
				abortControllerRef.current.signal
			);

			const botMsg = {
				id: Date.now() + 1,
				role: "bot",
				content: response.content,
				citations: response.citations,
			};

			setMessages((prev) => [...prev, botMsg]);
		} catch (error) {
			const errorMsg =
				error.message === "Aborted"
					? "Đã dừng tạo câu trả lời."
					: "Xin lỗi, đã có lỗi xảy ra khi kết nối với máy chủ.";

			setMessages((prev) => [
				...prev,
				{
					id: Date.now() + 2,
					role: "bot",
					content: errorMsg,
					citations: [],
				},
			]);
		} finally {
			setIsGenerating(false);
			abortControllerRef.current = null;
			setTimeout(() => inputRef.current?.focus(), 100);
		}
	};

	const handleStop = () => {
		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
		}
	};

	return (
		<div
			className={`flex flex-col bg-gray-50 h-full overflow-hidden ${className}`}>
			{/* Messages Area */}
			<div
				ref={scrollRef}
				className="flex-1 overflow-y-auto p-4 scroll-container bg-gray-50/50">
				{messages.map((msg) => (
					<ChatMessage key={msg.id} message={msg} />
				))}

				{isGenerating && (
					<div className="flex justify-start animate-pulse mb-4">
						<div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm text-gray-400 text-xs font-medium flex items-center gap-2">
							<Loader2 className="w-3 h-3 animate-spin" />
							Đang suy nghĩ...
						</div>
					</div>
				)}
			</div>

			{/* Input Area */}
			<div className="p-4 bg-white border-t border-gray-100 shrink-0">
				<form
					onSubmit={handleSend}
					className="relative flex items-center gap-2">
					<input
						ref={inputRef}
						type="text"
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						disabled={isGenerating}
						placeholder={
							isGenerating
								? "Đang chờ trả lời..."
								: "Hỏi tôi điều gì đó..."
						}
						className="w-full pl-4 pr-12 py-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-sm focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed placeholder:text-gray-400 text-gray-900"
					/>

					{isGenerating ? (
						<button
							type="button"
							onClick={handleStop}
							className="absolute right-2 p-2 bg-gray-900 text-white rounded-xl hover:bg-black transition-all shadow-sm animate-in fade-in zoom-in duration-200"
							title="Dừng">
							<Square className="w-4 h-4 fill-current" />
						</button>
					) : (
						<button
							type="submit"
							disabled={!inputValue.trim()}
							className="absolute right-2 p-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-30 disabled:hover:bg-purple-600 transition-all shadow-sm">
							<Send className="w-4 h-4" />
						</button>
					)}
				</form>

				<p className="text-[10px] text-center text-gray-400 mt-2 font-medium">
					AI có thể mắc lỗi. Vui lòng kiểm tra lại thông tin.
				</p>
			</div>
		</div>
	);
}
