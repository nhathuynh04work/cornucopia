import { Link } from "react-router-dom";
import PermissionGate from "@/components/PermissionGate";

export default function EmptyState({
	icon: Icon,
	title,
	description,
	actionLabel,
	actionLink,
	onAction,
	allowedRoles,
}) {
	const renderButton = () => {
		if (actionLink && actionLabel) {
			return (
				<Link
					to={actionLink}
					className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-xl transition-colors shadow-sm hover:shadow">
					{actionLabel}
				</Link>
			);
		}

		if (onAction && actionLabel) {
			return (
				<button
					onClick={onAction}
					className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-xl transition-colors shadow-sm hover:shadow">
					{actionLabel}
				</button>
			);
		}

		return null;
	};

	const button = renderButton();

	return (
		<div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-dashed border-gray-200">
			<div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mb-4 text-purple-500">
				<Icon className="w-8 h-8" />
			</div>
			<h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
			<p className="text-gray-500 max-w-sm mb-6 text-sm leading-relaxed">
				{description}
			</p>

			{button &&
				(allowedRoles ? (
					<PermissionGate allowedRoles={allowedRoles}>
						{button}
					</PermissionGate>
				) : (
					button
				))}
		</div>
	);
}
