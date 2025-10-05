import { Settings, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

function TestNavHeader({ test }) {
	const navigate = useNavigate();

	return (
		<header className="flex flex-col gap-3 p-4 border-b bg-gray-50/80 backdrop-blur-sm">
			<div className="flex justify-between items-center">
				<button
					onClick={() => navigate(-1, { replace: true })}
					className="flex items-center gap-1 text-sm text-gray-600 hover:text-black transition">
					<ArrowLeft className="w-4 h-4" /> Home
				</button>
				<button className="text-gray-600 hover:text-black">
					<Settings className="w-5 h-5" />
				</button>
			</div>

			<h2 className="font-medium text-md truncate">{test?.title}</h2>
		</header>
	);
}

export default TestNavHeader;
