import { User } from "lucide-react";
import StatCard from "@/components/Dashboard/StatCard";
import PageHeader from "@/components/Shared/PageHeader";
import { cn } from "@/lib/formatters";
import { Link } from "react-router";

export default function DashboardLayout({
	title,
	description,
	action,
	stats = [],
	children,
	className,
}) {
	return (
		<div
			className={cn(
				"h-[calc(100vh-64px)] flex flex-col p-4 lg:p-6 space-y-6 overflow-y-auto lg:overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500",
				className
			)}>
			<div className="flex-shrink-0">
				<PageHeader
					title={title}
					description={description}
					action={
						<div className="flex items-center gap-3">
							{action}
							<Link
								to={"/profile/me"}
								className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl transition-colors shadow-sm hover:shadow"
								title="Trang cá nhân">
								<User className="w-4 h-4" />
								Trang cá nhân
							</Link>
						</div>
					}
					className="!mb-4"
				/>
			</div>

			{stats.length > 0 && (
				<div className="flex-shrink-0">
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-none lg:grid-flow-col lg:auto-cols-fr gap-4">
						{stats.map((stat, index) => (
							<StatCard
								key={index}
								title={stat.title}
								count={stat.count}
								icon={stat.icon}
								color={stat.color}
								formattedValue={stat.formattedValue}
								isLoading={stat.isLoading}
							/>
						))}
					</div>
				</div>
			)}

			<div className="flex-1 min-h-0 w-full">{children}</div>
		</div>
	);
}
