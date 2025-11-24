import { User, Calendar } from "lucide-react";
import Avatar from "@/components/Shared/Avatar";

export default function TestAuthor({ user, createdAt }) {
	return (
		<div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
			<h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
				<User className="w-4 h-4 text-gray-400" /> Tác giả
			</h3>
			<div className="flex items-center gap-4">
				<Avatar url={user?.avatarUrl} name={user?.name} size="md" />
				<div>
					<p className="font-bold text-gray-900 text-sm">
						{user?.name || "Ẩn danh"}
					</p>
					<div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
						<Calendar className="w-3 h-3" />
						<span>
							Tạo ngày{" "}
							{new Date(createdAt).toLocaleDateString("vi-VN")}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
