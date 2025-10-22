import { useTestEditorStore } from "@/store/testEditorStore";
import { Settings, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import SettingsModal from "../SettingsModal/SettingsModal";

function TestNavHeader() {
	const navigate = useNavigate();
	const title = useTestEditorStore((s) => s.test?.title);

	return (
		<header className="flex flex-col gap-3 px-4 py-3 border-b bg-gray-50/80">
			<div className="flex justify-between items-center">
				{/* Back button */}
				<button
					onClick={() => navigate(-1, { replace: true })}
					className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 font-medium transition">
					<ArrowLeft className="w-3.5 h-3.5" />
					<span>Back</span>
				</button>

				<SettingsModal>
					<button className="p-1.5 rounded-md hover:bg-gray-100 transition text-gray-500 hover:text-gray-800">
						<Settings className="w-4 h-4" />
					</button>
				</SettingsModal>
			</div>

			<h2 className="font-medium text-sm text-gray-800 truncate leading-tight">
				{title || "Untitled Test"}
			</h2>
		</header>
	);
}

export default TestNavHeader;
