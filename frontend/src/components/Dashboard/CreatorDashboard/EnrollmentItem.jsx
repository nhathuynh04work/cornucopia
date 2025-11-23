import { formatRelativeTime } from "@/lib/formatters";

export default function EnrollmentItem({ enrollment }) {
	return (
		<div className="bg-white p-3 rounded-lg border border-gray-200 text-sm">
			<p className="font-semibold text-gray-800 truncate">
				{enrollment.userName}
			</p>
			<p className="text-gray-600 text-xs truncate">
				enrolled in <strong>{enrollment.courseName}</strong>
			</p>
			<p className="text-gray-500 text-xs">
				{formatRelativeTime(enrollment.date)}
			</p>
		</div>
	);
}
