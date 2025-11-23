import { Link } from "react-router-dom";
import { FileQuestion, Clock, Trophy } from "lucide-react";
import Avatar from "@/components/Avatar";
import StatusBadge from "@/components/StatusBadge";

function TestCard({ test }) {
	const { id, title, description, user, timeLimit, attempts, status } = test;
	const duration = Math.floor(timeLimit / 60);

	const isDraft = status === "DRAFT";
	const targetLink = isDraft ? `/tests/${id}/edit` : `/tests/${id}`;

	return (
		<Link
			to={targetLink}
			className="group flex flex-col bg-white rounded-2xl border border-gray-200 hover:border-purple-200 hover:shadow-lg transition-all duration-300 h-full overflow-hidden relative">
			{/* Status Badge Overlay for Non-Public tests */}
			{status !== "PUBLIC" && (
				<div className="absolute top-3 left-3 z-10">
					<StatusBadge
						status={status}
						size="xs"
						className="shadow-sm"
					/>
				</div>
			)}

			{/* Card Header / Icon */}
			<div className="h-32 bg-gradient-to-br from-purple-50 to-white flex items-center justify-center border-b border-gray-50 relative">
				<div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform duration-300">
					<FileQuestion className="w-6 h-6" />
				</div>

				{/* Duration Badge */}
				<div className="absolute top-3 right-3 px-2.5 py-1 bg-white/80 backdrop-blur-sm border border-gray-100 text-xs font-bold text-gray-600 rounded-lg flex items-center gap-1.5 shadow-sm">
					<Clock className="w-3 h-3" />
					{duration} phút
				</div>
			</div>

			{/* Content */}
			<div className="p-5 flex-1 flex flex-col">
				<h3 className="font-bold text-gray-900 text-lg line-clamp-2 mb-2 group-hover:text-purple-600 transition-colors">
					{title}
				</h3>

				<p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
					{description || "Chưa có mô tả cho bài kiểm tra này."}
				</p>

				{/* Footer Info */}
				<div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
					{/* Author */}
					<div className="flex items-center gap-2">
						<Avatar
							url={user?.avatarUrl}
							name={user?.name}
							size="xs"
						/>
						<span className="text-xs font-medium text-gray-600 truncate max-w-[100px]">
							{user?.name}
						</span>
					</div>

					{/* Stats */}
					<div className="flex items-center gap-3 text-xs text-gray-400">
						<div
							className="flex items-center gap-1"
							title="Lượt làm bài">
							<Trophy className="w-3.5 h-3.5" />
							<span>{attempts?.length || 0}</span>
						</div>
					</div>
				</div>
			</div>
		</Link>
	);
}

export default TestCard;
