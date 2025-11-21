import { Link } from "react-router-dom";
import { Eye, Pencil } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";

export default function CreatorContentItem({ item, type }) {
	const { id, title, status, enrollments, attempts } = item;

	const isDraft = status === "DRAFT";
	const showViewButton = type !== "flashcard" && !isDraft;

	const viewLink = `/${type}/${id}`;
	const editLink = `/${type}s/${id}/edit`;

	return (
		<div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center justify-between group hover:border-purple-300 transition-all duration-200">
			<div>
				<h4
					className="text-md font-semibold text-gray-800"
					title={title}>
					{title}
				</h4>
				<div className="flex items-center space-x-2 mt-1">
					{status && <StatusBadge status={status} size="xs" />}

					{type === "course" && (
						<>
							<span className="text-gray-300">•</span>
							<span className="text-xs text-gray-500">
								{enrollments} Enrollments
							</span>
						</>
					)}

					{type === "test" && (
						<>
							<span className="text-gray-300">•</span>
							<span className="text-xs text-gray-500">
								{attempts} Attempts
							</span>
						</>
					)}
				</div>
			</div>

			{/* Action Buttons */}
			<div className="flex items-center gap-2">
				{showViewButton && (
					<Link
						to={viewLink}
						className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
						title="View Details">
						<Eye className="w-4 h-4" />
					</Link>
				)}
				<Link
					to={editLink}
					className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
					title="Edit Content">
					<Pencil className="w-4 h-4" />
				</Link>
			</div>
		</div>
	);
}
