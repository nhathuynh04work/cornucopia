import { formatRelativeTime } from "@/lib/formatters";
import StatusBadge from "@/components/StatusBadge";

export default function AdminActivityItem({ item, type }) {
	const { name, date, role, creator } = item;

	const isUser = type === "user";
	const badgeLabel = isUser ? role : item.type;

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
			<StatusBadge status={badgeLabel} size="xs" />
		</div>
	);
}
