import { Minimize2, Sparkles } from "lucide-react";

function ChatHeader({ onClickMinimizeBtn }) {
	return (
		<div className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-5 shrink-0">
			<div className="flex items-center gap-3">
				<div className="w-9 h-9 rounded-full bg-purple-50 flex items-center justify-center border border-purple-100 text-purple-600">
					<Sparkles className="w-5 h-5" />
				</div>
				<div>
					<h3 className="font-bold text-gray-900 text-sm">
						Trợ lý Cornucopia
					</h3>
					<p className="text-xs text-green-600 flex items-center gap-1.5 font-medium">
						<span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
						Trực tuyến
					</p>
				</div>
			</div>
			<button
				onClick={onClickMinimizeBtn}
				className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
				<Minimize2 className="w-5 h-5" />
			</button>
		</div>
	);
}

export default ChatHeader;
