import { useEffect } from "react";
import { X, Check } from "lucide-react";

function StudyControls({ onRate, disabled }) {
	useEffect(() => {
		const handleKeyDown = (e) => {
			if (disabled) return;

			if (e.key === "ArrowLeft" || e.key === "1") {
				onRate(false);
			} else if (e.key === "ArrowRight" || e.key === "2") {
				onRate(true);
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [onRate, disabled]);

	return (
		<div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100 flex items-center justify-center gap-6 z-50">
			<button
				onClick={() => onRate(false)}
				disabled={disabled}
				className="group flex flex-col items-center justify-center w-24 h-24 rounded-3xl border-2 border-red-100 hover:bg-red-50 hover:border-red-200 transition-all disabled:opacity-50">
				<div className="w-10 h-10 rounded-full bg-red-100 text-red-500 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
					<X className="w-6 h-6 stroke-[3]" />
				</div>
				<span className="text-xs font-bold text-red-400 uppercase tracking-wider">
					Quên
				</span>
			</button>

			<button
				onClick={() => onRate(true)}
				disabled={disabled}
				className="group flex flex-col items-center justify-center w-24 h-24 rounded-3xl border-2 border-green-100 hover:bg-green-50 hover:border-green-200 transition-all disabled:opacity-50">
				<div className="w-10 h-10 rounded-full bg-green-100 text-green-500 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
					<Check className="w-6 h-6 stroke-[3]" />
				</div>
				<span className="text-xs font-bold text-green-500 uppercase tracking-wider">
					Nhớ
				</span>
			</button>
		</div>
	);
}

export default StudyControls;
