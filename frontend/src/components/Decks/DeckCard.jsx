import { Link } from "react-router-dom";
import { Users, Layers, BrainCircuit, Globe, BarChart2 } from "lucide-react";
import Avatar from "@/components/Shared/Avatar";
import StatusBadge from "@/components/Shared/StatusBadge";
import { LEVEL_OPTIONS, LANGUAGE_OPTIONS } from "@/lib/constants/common";

function DeckCard({ deck }) {
	const {
		id,
		title,
		user,
		isPublic,
		cardsCount,
		studySessionCount,
		level,
		language,
	} = deck;

	const targetLink = `/decks/${id}`;

	// Helper to get labels (assuming you have these constants, or fallback to value)
	const levelLabel =
		LEVEL_OPTIONS?.find((o) => o.value === level)?.label || level;
	const langLabel =
		LANGUAGE_OPTIONS?.find((o) => o.value === language)?.label || language;

	return (
		<Link
			to={targetLink}
			className="group flex flex-col md:flex-row bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-purple-200 transition-all duration-300 h-full relative">
			{/* --- ICON SECTION (Left Side) --- */}
			<div className="w-full md:w-48 shrink-0 relative bg-indigo-50 flex items-center justify-center min-h-[140px] md:min-h-0">
				<Layers className="w-12 h-12 text-indigo-300 group-hover:scale-110 transition-transform duration-500" />

				{/* Status Badge */}
				{!isPublic && (
					<div className="absolute top-3 left-3 z-10">
						<StatusBadge
							status="PRIVATE"
							size="xs"
							className="shadow-sm !bg-white/90 backdrop-blur-md"
						/>
					</div>
				)}
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
				<div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-gray-400 font-medium mb-auto uppercase tracking-wide">
					<div className="flex items-center gap-1.5">
						<BrainCircuit className="w-3.5 h-3.5" />
						<span>{studySessionCount || 0} lượt học</span>
					</div>

					<div className="w-1 h-1 rounded-full bg-gray-300"></div>

					<div className="flex items-center gap-1.5">
						<Layers className="w-3.5 h-3.5" />
						<span>{cardsCount || 0} thẻ</span>
					</div>
				</div>

				{/* Footer */}
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

export default DeckCard;
