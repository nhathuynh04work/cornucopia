import { Settings, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";
import SettingsModal from "./SettingsModal/SettingsModal";

function TestNavHeader({ test }) {
	const navigate = useNavigate();
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);

	return (
		<>
			<header className="flex flex-col gap-3 px-4 py-3 border-b bg-gray-50/80 backdrop-blur-sm">
				<div className="flex justify-between items-center">
					{/* Back button */}
					<button
						onClick={() => navigate(-1, { replace: true })}
						className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 font-medium transition">
						<ArrowLeft className="w-3.5 h-3.5" />
						<span>Back</span>
					</button>

					{/* Settings button */}
					<button
						onClick={() => setIsSettingsOpen(true)}
						className="p-1.5 rounded-md hover:bg-gray-100 transition text-gray-500 hover:text-gray-800">
						<Settings className="w-4 h-4" />
					</button>
				</div>

				<h2 className="font-medium text-sm text-gray-800 truncate leading-tight">
					{test?.title || "Untitled Test"}
				</h2>
			</header>

			<SettingsModal
				test={test}
				isOpen={isSettingsOpen}
				onClose={() => setIsSettingsOpen(false)}
			/>
		</>
	);
}

export default TestNavHeader;
