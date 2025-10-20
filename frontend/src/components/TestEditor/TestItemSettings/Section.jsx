export function Section({ title, children }) {
	return (
		<div className="border-b border-gray-200 px-4 py-3">
			<h3 className="text-[10px] font-medium uppercase text-gray-700 tracking-wide mb-3">
				{title}
			</h3>
			{children}
		</div>
	);
}
