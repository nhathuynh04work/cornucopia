import { useState } from "react";
import { History, MessageSquare } from "lucide-react";
import TestHistory from "./TestHistory";
import CommentSection from "@/components/Comments/CommentSection";

export default function TestTabs({ testId }) {
	const [activeTab, setActiveTab] = useState("history");

	return (
		<div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
			{/* Tab Header */}
			<div className="flex border-b border-gray-100">
				<button
					onClick={() => setActiveTab("history")}
					className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold transition-all relative ${
						activeTab === "history"
							? "text-purple-600 bg-purple-50/50"
							: "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
					}`}>
					<History className="w-4 h-4" />
					Lịch sử làm bài
					{activeTab === "history" && (
						<div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 animate-in fade-in zoom-in-x duration-300" />
					)}
				</button>
				<button
					onClick={() => setActiveTab("comments")}
					className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold transition-all relative ${
						activeTab === "comments"
							? "text-purple-600 bg-purple-50/50"
							: "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
					}`}>
					<MessageSquare className="w-4 h-4" />
					Bình luận
					{activeTab === "comments" && (
						<div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 animate-in fade-in zoom-in-x duration-300" />
					)}
				</button>
			</div>

			{/* Tab Content */}
			<div>
				{activeTab === "history" && <TestHistory testId={testId} />}
				{activeTab === "comments" && <CommentSection testId={testId} />}
			</div>
		</div>
	);
}
