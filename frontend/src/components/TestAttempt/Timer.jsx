import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/formatters";

export default function Timer({ seconds }) {
	const [timeLeft, setTimeLeft] = useState(seconds);

	useEffect(() => {
		const timer = setInterval(
			() => setTimeLeft((p) => Math.max(0, p - 1)),
			1000
		);
		return () => clearInterval(timer);
	}, []);

	const hrs = Math.floor(timeLeft / 3600);
	const mins = Math.floor((timeLeft % 3600) / 60);
	const secs = timeLeft % 60;
	const isUrgent = timeLeft < 300;

	return (
		<div
			className={cn(
				"flex items-center gap-2 font-mono font-bold text-lg px-3 py-1.5 rounded-lg border transition-colors whitespace-nowrap",
				isUrgent
					? "bg-red-50 text-red-600 border-red-200"
					: "bg-purple-50 text-purple-700 border-purple-100"
			)}>
			<Clock className="w-4 h-4" />
			<span>
				{hrs > 0 && `${hrs}:`}
				{String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
			</span>
		</div>
	);
}
