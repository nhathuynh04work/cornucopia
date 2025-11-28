import { ArrowLeft, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CircularProgress = ({ percentage, size = 42, strokeWidth = 4 }) => {
	const radius = (size - strokeWidth) / 2;
	const circumference = radius * 2 * Math.PI;
	const offset = circumference - (percentage / 100) * circumference;

	return (
		<div className="relative flex items-center justify-center">
			<svg width={size} height={size} className="transform -rotate-90">
				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					fill="transparent"
					className="text-gray-100"
					strokeWidth={strokeWidth}
					stroke="currentColor"
				/>
				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					fill="transparent"
					className="text-purple-600 transition-all duration-1000 ease-out"
					strokeWidth={strokeWidth}
					strokeDasharray={circumference}
					strokeDashoffset={offset}
					strokeLinecap="round"
					stroke="currentColor"
				/>
			</svg>
			<span className="absolute text-[10px] font-bold text-gray-700">
				{Math.round(percentage)}%
			</span>
		</div>
	);
};

export default function CourseLearnHeader({
	course,
	progress,
	completedLessonsCount,
	totalLessonsCount,
	isSidebarOpen,
	setIsSidebarOpen,
}) {
	const navigate = useNavigate();

	return (
		// REMOVED: shadow-sm class
		<header className="h-16 border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 bg-white z-20 shrink-0 relative">
			<div className="flex items-center gap-4">
				<button
					onClick={() => navigate("/courses")}
					className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
					title="Back to Courses">
					<ArrowLeft className="w-5 h-5" />
				</button>

				<div className="flex flex-col">
					<h1 className="font-bold text-gray-900 text-sm md:text-base line-clamp-1 max-w-[200px] md:max-w-md">
						{course.title}
					</h1>
				</div>
			</div>

			<div className="flex items-center gap-4">
				<div className="hidden lg:flex items-center gap-3">
					<div className="text-right">
						<p className="text-xs text-gray-500 font-medium">
							Tiến độ
						</p>
						<p className="text-xs font-bold text-purple-700">
							{completedLessonsCount}/{totalLessonsCount} bài học
						</p>
					</div>
					<CircularProgress percentage={progress} />
				</div>

				<button
					onClick={() => setIsSidebarOpen(!isSidebarOpen)}
					className="lg:hidden p-2 hover:bg-gray-100 rounded-md text-gray-600">
					{isSidebarOpen ? (
						<X className="w-5 h-5" />
					) : (
						<Menu className="w-5 h-5" />
					)}
				</button>
			</div>
		</header>
	);
}
