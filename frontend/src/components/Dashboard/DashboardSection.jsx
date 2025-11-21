export default function DashboardSection({ title, children, action }) {
	return (
		<section className="flex flex-col">
			<div className="flex justify-between items-center mb-5">
				<h2 className="text-xl font-semibold text-gray-700">{title}</h2>
				{action && <div>{action}</div>}
			</div>
			<div className="flex-1">{children}</div>
		</section>
	);
}
