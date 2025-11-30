import { Settings, Calendar, Star } from "lucide-react";
import Avatar from "@/components/Shared/Avatar";
import StatusBadge from "@/components/Shared/StatusBadge";

export default function LibraryProfile({ user, isCreator, formatDate }) {
	return (
		<div className="bg-white rounded-3xl border border-gray-200 p-8 mb-8 shadow-sm">
			<div className="flex flex-col md:flex-row items-center md:items-start gap-6">
				<div className="relative shrink-0">
					<Avatar url={user.avatarUrl} name={user.name} size="xl" />
				</div>
				<div className="flex-1 text-center md:text-left">
					<div className="flex flex-col md:flex-row items-center md:items-start gap-2 mb-2">
						<h1 className="text-2xl font-bold text-gray-900">
							{user.name}
						</h1>
						{isCreator && (
							<StatusBadge
								status="CREATOR"
								label="Giảng viên"
								className="bg-blue-50 text-blue-600 border-blue-100 mt-1 md:mt-0"
							/>
						)}
					</div>
					<p className="text-gray-500 text-sm mb-4 max-w-2xl">
						{user.bio || "Chưa có giới thiệu."}
					</p>
					<div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-xs font-medium text-gray-500">
						<div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg">
							<Calendar className="w-3.5 h-3.5" />
							Tham gia {formatDate(user.createdAt)}
						</div>
					</div>
				</div>
				<div className="shrink-0">
					<button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all">
						<Settings className="w-4 h-4" />
						Cài đặt
					</button>
				</div>
			</div>
		</div>
	);
}
