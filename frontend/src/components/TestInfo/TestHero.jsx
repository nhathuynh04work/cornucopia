import { Play, Edit3, Globe, BarChart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Role } from "@/lib/constants";
import { useAuth } from "@/contexts/AuthContext";
import { LEVEL_OPTIONS, LANGUAGE_OPTIONS } from "@/lib/constants/common";

export default function TestHero({ test }) {
	const navigate = useNavigate();
	const { user } = useAuth();

	const isOwner = user?.id === test.userId;
	const canEdit = user?.role === Role.ADMIN || isOwner;

	// Helper to get labels
	const getLabel = (options, value) =>
		options.find((o) => o.value === value)?.label || value;

	const levelLabel = getLabel(LEVEL_OPTIONS, test.level);
	const langLabel = getLabel(LANGUAGE_OPTIONS, test.language);

	return (
		<div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
			{/* Decorative Background Blob */}
			<div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-purple-50 rounded-full blur-3xl opacity-50 group-hover:bg-purple-100 transition-colors duration-700 pointer-events-none"></div>

			<div className="relative z-10">
				<div className="flex items-start justify-between gap-4 mb-4">
					{/* Standardized Badges */}
					<div className="flex flex-wrap items-center gap-2">
						<div className="flex items-center gap-1.5 bg-blue-50 px-2.5 py-1 rounded-full text-blue-700 text-xs font-bold border border-blue-100">
							<BarChart className="w-3 h-3" />
							{levelLabel}
						</div>

						<div className="flex items-center gap-1.5 bg-indigo-50 px-2.5 py-1 rounded-full text-indigo-700 text-xs font-bold border border-indigo-100">
							<Globe className="w-3 h-3" />
							{langLabel}
						</div>
					</div>

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
						className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg shadow-purple-200 transition-all hover:-translate-y-0.5 text-sm">
						<Play className="w-4 h-4 fill-current" />
						Làm bài ngay
					</button>
				</div>
			</div>
		</div>
	);
}
