import { Link } from "react-router-dom";
import PermissionGate from "@/components/Shared/PermissionGate";

export default function EmptyState({
	icon: Icon,
	title,
	description,
	actionLabel,
	actionLink,
	onAction,
	allowedRoles,
	children,
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
		<div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-3xl border border-gray-200 shadow-sm px-6">
			{Icon && (
				<div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-400">
					<Icon className="w-10 h-10" />
				</div>
			)}
			<h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
			<p className="text-gray-500 max-w-md mb-6 leading-relaxed">
				{description}
			</p>

			{/* Render children if provided (e.g. Clear Filters), otherwise render standard button */}
			{children
				? children
				: button &&
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
