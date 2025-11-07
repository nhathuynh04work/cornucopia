import { AlertTriangle, Loader2 } from "lucide-react";

const variantStyles = {
	danger: {
		iconBg: "bg-red-100",
		iconColor: "text-red-600",
		buttonBg: "bg-red-600",
		buttonHover: "hover:bg-red-700",
		buttonDisabled: "disabled:bg-red-300",
		Icon: AlertTriangle,
	},
	primary: {
		iconBg: "bg-purple-100",
		iconColor: "text-purple-600",
		buttonBg: "bg-purple-600",
		buttonHover: "hover:bg-purple-700",
		buttonDisabled: "disabled:bg-purple-300",
		Icon: AlertTriangle,
	},
};

export default function ConfirmationModal({
	title,
	children,
	variant = "danger",
	confirmText = "Confirm",
	onConfirm,
	onCancel,
	isLoading,
}) {
	const styles = variantStyles[variant] || variantStyles.danger;
	const { Icon } = styles;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
			<div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
				<div className="flex items-start gap-4">
					<div
						className={`flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full ${styles.iconBg}`}>
						<Icon className={`w-6 h-6 ${styles.iconColor}`} />
					</div>
					<div>
						<h3 className="text-lg font-medium text-gray-900">
							{title}
						</h3>
						{/* Render description content as children */}
						<div className="mt-2 text-sm text-gray-600">
							{children}
						</div>
					</div>
				</div>
				<div className="flex justify-end gap-3 mt-6">
					<button
						type="button"
						onClick={onCancel}
						disabled={isLoading}
						className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
						Cancel
					</button>
					<button
						type="button"
						onClick={onConfirm}
						disabled={isLoading}
						className={`flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-md ${styles.buttonBg} ${styles.buttonHover} ${styles.buttonDisabled}`}>
						{isLoading ? (
							<Loader2 className="w-4 h-4 animate-spin" />
						) : (
							confirmText
						)}
					</button>
				</div>
			</div>
		</div>
	);
}
