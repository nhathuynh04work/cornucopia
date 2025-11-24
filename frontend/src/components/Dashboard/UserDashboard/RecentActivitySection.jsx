import { useState, useMemo } from "react";
import { Library, FileText, CheckCircle2, Filter } from "lucide-react";
import ActivityListItem from "../ActivityListItem";

export default function RecentActivitySection({ recentActivity }) {
	const [activityFilter, setActivityFilter] = useState("ALL");

	const filteredActivities = useMemo(() => {
		if (!recentActivity?.sessions) return [];
		if (activityFilter === "ALL") return recentActivity.sessions;
		return recentActivity.sessions.filter(
			(item) => item.type === activityFilter
		);
	}, [recentActivity, activityFilter]);

	return (
		<div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-full flex flex-col min-h-0">
			{/* Header & Filters */}
			<div className="flex items-center justify-between mb-4 flex-shrink-0">
				<div className="flex items-center gap-2">
					<h2 className="text-lg font-bold text-gray-900">
						Hoạt động gần đây
					</h2>
					<span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-bold rounded-full">
						{filteredActivities.length}
					</span>
				</div>

				{/* Icon-based Filter Group */}
				<div className="flex items-center gap-2 bg-gray-50 p-1 rounded-lg border border-gray-200">
					<button
						onClick={() => setActivityFilter("ALL")}
						title="Tất cả"
						className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${
							activityFilter === "ALL"
								? "bg-white text-purple-600 shadow-sm"
								: "text-gray-500 hover:text-gray-900"
						}`}>
						Tất cả
					</button>
					<button
						onClick={() => setActivityFilter("SESSION")}
						title="Học bộ thẻ"
						className={`p-1.5 rounded-md transition-colors ${
							activityFilter === "SESSION"
								? "bg-white text-purple-600 shadow-sm"
								: "text-gray-400 hover:text-gray-900"
						}`}>
						<Library className="w-4 h-4" />
					</button>
					<button
						onClick={() => setActivityFilter("TEST")}
						title="Bài kiểm tra"
						className={`p-1.5 rounded-md transition-colors ${
							activityFilter === "TEST"
								? "bg-white text-blue-600 shadow-sm"
								: "text-gray-400 hover:text-gray-900"
						}`}>
						<FileText className="w-4 h-4" />
					</button>
					<button
						onClick={() => setActivityFilter("LESSON")}
						title="Bài học"
						className={`p-1.5 rounded-md transition-colors ${
							activityFilter === "LESSON"
								? "bg-white text-green-600 shadow-sm"
								: "text-gray-400 hover:text-gray-900"
						}`}>
						<CheckCircle2 className="w-4 h-4" />
					</button>
				</div>
			</div>

			{/* Scrollable List */}
			<div className="flex-1 pr-2 scroll-container min-h-0">
				{filteredActivities.length > 0 ? (
					<div className="space-y-3 pb-2">
						{filteredActivities.map((item) => (
							<ActivityListItem key={item.id} item={item} />
						))}
					</div>
				) : (
					<div className="h-full flex flex-col items-center justify-center text-center text-gray-400 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-100 p-8">
						<Filter className="w-8 h-8 mb-2 opacity-20" />
						<p className="text-sm font-medium">
							Không có hoạt động nào phù hợp với bộ lọc.
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
