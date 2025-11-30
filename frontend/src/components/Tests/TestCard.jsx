import { Link } from "react-router-dom";
import { Users, FileText, Clock, Trophy, Globe, BarChart2 } from "lucide-react";
import Avatar from "@/components/Shared/Avatar";
import { LEVEL_OPTIONS, LANGUAGE_OPTIONS } from "@/lib/constants/common";

const formatDuration = (seconds) => {
	if (!seconds) return "--";
	const minutes = Math.floor(seconds / 60);
	return `${minutes} phút`;
};

function TestCard({ test }) {
	console.log(test);
	const {
		id,
		title,
		user,
		status,
		questionsCount,
		timeLimit,
		attemptsCount,
		level,
		language,
	} = test;

	const isDraft = status === "DRAFT";
	const targetLink = isDraft ? `/tests/${id}/edit` : `/tests/${id}`;

	// Helper to get labels
	const levelLabel =
		LEVEL_OPTIONS?.find((o) => o.value === level)?.label || level;
	const langLabel =
		LANGUAGE_OPTIONS?.find((o) => o.value === language)?.label || language;

	return (
		<Link
			to={targetLink}
			className="group flex flex-col md:flex-row bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-purple-200 transition-all duration-300 h-full relative">
			{/* --- ICON SECTION (Left Side) --- */}
			<div className="w-full md:w-48 shrink-0 relative bg-blue-50 flex items-center justify-center min-h-[140px] md:min-h-0">
				<Trophy className="w-12 h-12 text-blue-300 group-hover:scale-110 transition-transform duration-500" />
			</div>

			{/* --- CONTENT SECTION (Right Side) --- */}
			<div className="flex-1 p-5 flex flex-col min-w-0">
				{/* Header */}
				<div className="flex justify-between items-start gap-4 mb-2">
					<div className="space-y-1.5">
						{/* Metadata Badges */}
						<div className="flex flex-wrap items-center gap-2 text-[10px] font-bold tracking-wider uppercase text-gray-500">
							<div className="flex items-center gap-1 text-purple-600">
								<Globe className="w-3 h-3" />
								{langLabel}
							</div>
							<span className="w-0.5 h-3 bg-gray-200"></span>
							<div className="flex items-center gap-1 text-blue-600">
								<BarChart2 className="w-3 h-3" />
								{levelLabel}
							</div>
						</div>

						<h3 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-purple-700 transition-colors line-clamp-2">
							{title}
						</h3>
					</div>
				</div>

				{/* Stats Row */}
				<div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-gray-400 font-medium mb-auto uppercase tracking-wide mt-1">
					<div className="flex items-center gap-1.5">
						<Users className="w-3.5 h-3.5" />
						<span>{attemptsCount || 0} lượt thi</span>
					</div>

					<div className="w-1 h-1 rounded-full bg-gray-300"></div>

					<div className="flex items-center gap-1.5">
						<Clock className="w-3.5 h-3.5" />
						<span>{formatDuration(timeLimit)}</span>
					</div>

					<div className="w-1 h-1 rounded-full bg-gray-300"></div>

					<div className="flex items-center gap-1.5">
						<FileText className="w-3.5 h-3.5" />
						<span>{questionsCount || 0} câu hỏi</span>
					</div>
				</div>

				{/* Footer: Author */}
				<div className="pt-4 border-t border-gray-50 flex items-center gap-2 mt-4">
					<Avatar url={user?.avatarUrl} name={user?.name} size="xs" />
					<span className="text-xs font-bold text-gray-700 truncate max-w-[200px]">
						{user?.name}
					</span>
				</div>
			</div>
		</Link>
	);
}

export default TestCard;
