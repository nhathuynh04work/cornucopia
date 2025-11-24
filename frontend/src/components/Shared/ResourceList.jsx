import { Loader2, AlertCircle } from "lucide-react";
import EmptyState from "./EmptyState";
import PermissionGate from "./PermissionGate";

export default function ResourceList({
	isLoading,
	isError,
	data = [],
	renderItem,
	resourceName = "dữ liệu",
	emptyState,
	gridCols = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
	children,
}) {
	if (isLoading) {
		return (
			<div className="h-96 flex flex-col items-center justify-center text-gray-400">
				<Loader2 className="w-10 h-10 animate-spin mb-3 text-purple-500" />
				<p>Đang tải {resourceName}...</p>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="h-96 flex flex-col items-center justify-center text-red-500 bg-red-50 rounded-2xl border border-red-100 p-8">
				<AlertCircle className="w-10 h-10 mb-3" />
				<p>Không thể tải {resourceName}. Vui lòng thử lại sau.</p>
			</div>
		);
	}

	if (!data || data.length === 0) {
		return <EmptyState {...emptyState} />;
	}

	if (children) {
		return children;
	}

	return (
		<div className={`grid ${gridCols} gap-6`}>
			{data.map((item) => renderItem(item))}
		</div>
	);
}

ResourceList.Action = function ResourceAction({
	actionLabel,
	onAction,
	icon: Icon,
	allowedRoles,
	isBusy,
}) {
	return (
		<PermissionGate allowedRoles={allowedRoles}>
			<button
				onClick={onAction}
				disabled={isBusy}
				className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl transition-colors shadow-sm hover:shadow disabled:opacity-70">
				{isBusy ? (
					<Loader2 className="w-4 h-4 animate-spin" />
				) : (
					Icon && <Icon className="w-4 h-4" />
				)}
				{actionLabel}
			</button>
		</PermissionGate>
	);
};
