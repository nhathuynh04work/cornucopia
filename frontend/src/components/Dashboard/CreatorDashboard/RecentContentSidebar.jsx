import { Link } from "react-router-dom";
import { BookOpen, Layers, FileQuestion, FileText } from "lucide-react";
import StatusBadge from "@/components/Shared/StatusBadge";

const getContentIcon = (type) => {
	switch (type) {
		case "COURSE":
			return BookOpen;
		case "DECK":
			return Layers;
		case "TEST":
			return FileQuestion;
		case "POST":
			return FileText;
		default:
			return FileText;
	}
};

export default function RecentContentSidebar({ recentContent }) {
	return (
		<div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-full flex flex-col min-h-[400px]">
			<h2 className="text-lg font-bold text-gray-900 mb-6 flex-shrink-0">
				Nội dung gần đây
			</h2>

			<div className="flex-1 overflow-y-auto scroll-container pr-2 min-h-0">
				{recentContent.length > 0 ? (
					<div className="space-y-4">
						{recentContent.map((item) => {
							const Icon = getContentIcon(item.type);
							// Assumes format like "course-123"
							const idValue = item.id.split("-")[1];
							const typePath =
								item.type.toLowerCase() === "post"
									? "posts"
									: `${item.type.toLowerCase()}s`;
							const link = `/${typePath}/${idValue}`;

							return (
								<Link
									to={link}
									key={item.id}
									className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors group">
									<div className="flex items-center gap-4 min-w-0">
										<Icon className="w-5 h-5 text-gray-400 group-hover:text-purple-600 shrink-0" />
										<div className="min-w-0">
											<h4 className="text-sm font-bold text-gray-900 truncate group-hover:text-purple-600 transition-colors">
												{item.title || item.name}
											</h4>
											<p className="text-xs text-gray-500 mt-0.5">
												{item.type} • Cập nhật:{" "}
												{new Date(
													item.updatedAt
												).toLocaleDateString("vi-VN")}
											</p>
										</div>
									</div>
									<StatusBadge
										status={item.status}
										size="xs"
									/>
								</Link>
							);
						})}
					</div>
				) : (
					<p className="text-center text-gray-400 text-sm py-8">
						Chưa có nội dung nào.
					</p>
				)}
			</div>
		</div>
	);
}
