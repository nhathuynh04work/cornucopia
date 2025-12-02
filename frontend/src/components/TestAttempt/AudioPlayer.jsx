import { useState, useEffect, useRef } from "react";
import { Play, Pause, Volume2 } from "lucide-react";

export default function AudioPlayer({ src }) {
	const audioRef = useRef(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [progress, setProgress] = useState(0);
	const [duration, setDuration] = useState(0);

	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		const updateTime = () =>
			setProgress((audio.currentTime / audio.duration) * 100);
		const updateDuration = () => setDuration(audio.duration);

		audio.addEventListener("timeupdate", updateTime);
		audio.addEventListener("loadedmetadata", updateDuration);

		return () => {
			audio.removeEventListener("timeupdate", updateTime);
			audio.removeEventListener("loadedmetadata", updateDuration);
		};
	}, []);

	const togglePlay = () => {
		if (audioRef.current.paused) {
			audioRef.current.play();
			setIsPlaying(true);
		} else {
			audioRef.current.pause();
			setIsPlaying(false);
		}
	};

	const formatTime = (seconds) => {
		if (!seconds) return "00:00";
		const m = Math.floor(seconds / 60);
		const s = Math.floor(seconds % 60);
		return `${m}:${s < 10 ? "0" : ""}${s}`;
	};

	return (
		<div className="flex items-center gap-3 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-full shadow-sm max-w-md w-full">
			<audio ref={audioRef} src={src} />
			<button
				onClick={togglePlay}
				className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors shadow-sm">
				{isPlaying ? (
					<Pause className="w-4 h-4 fill-current" />
				) : (
					<Play className="w-4 h-4 fill-current ml-0.5" />
				)}
			</button>

			<div className="flex-1 flex flex-col justify-center gap-1">
				<div className="flex justify-between text-[10px] text-gray-500 font-bold font-mono">
					<span>
						{formatTime(audioRef.current?.currentTime || 0)}
					</span>
					<span>{formatTime(duration)}</span>
				</div>
				<div className="h-1.5 bg-gray-100 rounded-full w-full overflow-hidden cursor-pointer relative">
					<div
						className="absolute top-0 left-0 h-full bg-purple-600 transition-all duration-100"
						style={{ width: `${progress}%` }}
					/>
				</div>
			</div>
			<Volume2 className="w-4 h-4 text-gray-400" />
		</div>
	);
}
