import { Role } from "@/lib/constants";
import { formatRelativeTime } from "@/lib/text";

export default function AdminActivityItem({ item, type }) {
	const { name, date, role, creator } = item;

	const isUser = type === "user";
	const tagText = isUser ? role : item.type; // 'USER', 'CREATOR', 'Course', 'Test', etc.

	let tagColor = "bg-blue-100 text-blue-800"; // Default for content
	if (isUser) {
		tagColor =
			role === Role.CREATOR
				? "bg-purple-100 text-purple-800"
				: "bg-gray-100 text-gray-800";
	}

	return (
		<div className="bg-white p-3 rounded-lg border border-gray-200 flex items-center justify-between">
			<div>
				<p className="font-semibold text-gray-800">{name}</p>
				<p className="text-xs text-gray-500">
					{isUser
						? `Joined: ${formatRelativeTime(date)}`
						: `By: ${creator} | ${formatRelativeTime(date)}`}
				</p>
			</div>
			<span
				className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${tagColor}`}>
				{tagText}
			</span>
		</div>
	);
}
