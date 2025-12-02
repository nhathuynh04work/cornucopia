import { Settings, Calendar, Star, Shield } from "lucide-react";
import Avatar from "@/components/Shared/Avatar";
import Badge from "@/components/Shared/Badge";
import { formatVNDate } from "@/lib/formatters";

export default function ProfileHeader({ user, isOwnProfile, onEdit }) {
	const isCreator = user.role === "CREATOR" || user.role === "ADMIN";

	return (
		<div className="bg-white rounded-3xl border border-gray-200 p-6 md:p-8 mb-6 md:mb-8 shadow-sm relative overflow-hidden">
			{/* Decoration */}
			<div className="absolute top-0 right-0 w-64 h-64 bg-purple-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50 pointer-events-none" />

			<div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
				<div className="relative shrink-0">
					<Avatar url={user?.avatarUrl} name={user?.name} size="xl" />
					{isCreator && (
						<div
							className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-1 rounded-full ring-2 ring-white"
							title="Verified Creator">
							<Shield className="w-4 h-4 fill-current" />
						</div>
					)}
				</div>

				<div className="flex-1 text-center md:text-left space-y-3 w-full">
					<div>
						<div className="flex flex-col md:flex-row items-center md:items-start gap-2 justify-center md:justify-start">
							<h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
								{user.name}
							</h1>
							{isCreator ? (
								<Badge variant="info" className="mt-1">
									Giảng viên
								</Badge>
							) : (
								<Badge
									variant="default"
									className="mt-1 bg-gray-100 text-gray-600">
									Học viên
								</Badge>
							)}
						</div>
						<p className="text-gray-500 text-sm mt-2 max-w-2xl mx-auto md:mx-0 leading-relaxed">
							{user.bio || "Chưa có thông tin giới thiệu."}
						</p>
					</div>

					<div className="flex flex-wrap items-center justify-center md:justify-start gap-3 md:gap-4 text-xs font-medium text-gray-500 pt-2">
						<div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
							<Calendar className="w-3.5 h-3.5 text-gray-400" />
							<span>Tham gia {formatVNDate(user.createdAt)}</span>
						</div>

						{isCreator && user.averageRating > 0 && (
							<div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg border border-amber-100 shadow-sm">
								<Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
								<span className="font-bold">
									{Number(user.averageRating).toFixed(1)}
								</span>
								<span>đánh giá trung bình</span>
							</div>
						)}
					</div>
				</div>

				{isOwnProfile && (
					<div className="shrink-0 flex gap-2 w-full md:w-auto justify-center md:justify-start">
						<button
							onClick={onEdit}
							className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 transition-all shadow-sm w-full md:w-auto">
							<Settings className="w-4 h-4" />
							<span>Cài đặt</span>
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
