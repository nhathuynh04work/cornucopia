import { useState } from "react";
import { MessageCircle, X, Sparkles, Minimize2 } from "lucide-react";
import ChatWindow from "./ChatWindow";
import ChatHeader from "./ChatHeader";

export default function ChatWidget() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4 font-sans">
			{isOpen && (
				<div className="w-[90vw] sm:w-96 h-[600px] max-h-[80vh] bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col animate-in slide-in-from-bottom-10 fade-in duration-300 origin-bottom-right">
					{/* Header is specific to the Widget implementation */}
					<ChatHeader onClickMinimizeBtn={() => setIsOpen(false)} />

					{/* Reusable Window */}
					<ChatWindow />
				</div>
			)}

			<button
				onClick={() => setIsOpen(!isOpen)}
				className={`h-14 w-14 rounded-2xl shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-105 z-50 ${
					isOpen
						? "bg-white text-gray-800 border border-gray-200 rotate-90 hover:bg-gray-50"
						: "bg-purple-600 text-white hover:bg-purple-700"
				}`}>
				{isOpen ? (
					<X className="w-6 h-6" />
				) : (
					<MessageCircle className="w-7 h-7" />
				)}
			</button>
		</div>
	);
}
