import { Users, Clock, FileText } from "lucide-react";
import { Link, useLocation } from "react-router";

export default function TestCard({ test }) {
	const { pathname } = useLocation();
	const isAdmin = pathname.startsWith("/tests/admin");

	const attempts = test._count?.attempts || 0;
	const questions = test._count?.items || 0;
	const duration = test.timeLimit;

	return (
		<Link
			to={
				test.status === "DRAFT"
					? `/tests/${test.id}/edit`
					: `/tests/${test.id}`
			}
			className="group relative block rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-purple-300 hover:translate-y-[-2px] focus:ring-2 focus:ring-purple-500">
			{/* Header */}
			<div className="mb-3">
				<h2
					className="text-sm font-semibold text-gray-900 truncate group-hover:text-purple-600 transition-colors"
					title={test.title}>
					{test.title}
				</h2>
				{isAdmin && test.status === "DRAFT" && (
					<span className="mt-1 inline-block text-[10px] font-medium text-yellow-600 bg-yellow-50 border border-yellow-200 rounded-full px-2 py-[1px]">
						Draft
					</span>
				)}
			</div>

			{/* Stats */}
			<div className="flex flex-col gap-2 text-gray-600">
				<div className="flex items-center">
					<FileText className="w-4 h-4 mr-2 text-gray-400" />
					<span className="text-xs font-medium">{questions} Qs</span>
				</div>
				<div className="flex items-center">
					<Clock className="w-4 h-4 mr-2 text-gray-400" />
					<span className="text-xs font-medium">
						{duration ? `${duration} mins` : "No limit"}
					</span>
				</div>
				<div className="flex items-center">
					<Users className="w-4 h-4 mr-2 text-gray-400" />
					<span className="text-xs font-medium">
						{attempts} attempts
					</span>
				</div>
			</div>

			{/* Bottom accent bar */}
			<div className="absolute bottom-0 left-0 w-full h-[3px] bg-purple-100 rounded-b-xl group-hover:bg-purple-400 transition-colors"></div>
		</Link>
	);
}
