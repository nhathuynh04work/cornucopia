import { cn } from "@/lib/formatters";

export default function PageHeader({ title, description, action, className }) {
	return (
		<div
			className={cn(
				"flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8",
				className
			)}>
			<div>
				<h1 className="text-2xl font-bold text-gray-900">{title}</h1>
				{description && (
					<p className="text-gray-500 mt-1 text-sm">{description}</p>
				)}
			</div>
			{action && <div className="flex-shrink-0">{action}</div>}
		</div>
	);
}
