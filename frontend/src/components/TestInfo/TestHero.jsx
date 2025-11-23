import { Play, Edit3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Role } from "@/lib/constants";
import StatusBadge from "@/components/StatusBadge";
import { useAuth } from "@/contexts/AuthContext";

export default function TestHero({ test }) {
	const navigate = useNavigate();
	const { user } = useAuth();

	const isOwner = user?.id === test.userId;
	const canEdit = user?.role === Role.ADMIN || isOwner;

	return (
		<div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
			{/* Decorative Background Blob */}
			<div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-purple-50 rounded-full blur-3xl opacity-50 group-hover:bg-purple-100 transition-colors duration-700 pointer-events-none"></div>

			<div className="relative z-10">
				<div className="flex items-start justify-between gap-4 mb-4">
					<StatusBadge status={test.status} />
					{canEdit && (
						<button
							onClick={() => navigate(`/tests/${test.id}/edit`)}
							className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-purple-600 rounded-xl transition-colors"
							title="Chỉnh sửa bài thi">
							<Edit3 className="w-5 h-5" />
						</button>
					)}
				</div>

				<h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
					{test.title}
				</h1>

				<p className="text-gray-500 text-lg leading-relaxed mb-8">
					{test.description ||
						"Chưa có mô tả cho bài kiểm tra này. Hãy thử sức để kiểm tra kiến thức của bạn!"}
				</p>

				<div className="flex flex-wrap gap-4">
					<button
						onClick={() => navigate(`/tests/${test.id}/take`)}
						className="flex-1 sm:flex-none inline-flex items-center justify-center gap-3 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl shadow-lg shadow-purple-200 transition-all hover:-translate-y-1">
						<Play className="w-5 h-5 fill-current" />
						Làm bài ngay
					</button>
				</div>
			</div>
		</div>
	);
}
