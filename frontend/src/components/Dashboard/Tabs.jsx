export default function Tabs({ tabs, activeTab, onTabChange }) {
	return (
		<div className="border-b border-gray-200 mb-4">
			<nav className="-mb-px flex space-x-8" aria-label="Tabs">
				{tabs.map((tab) => (
					<button
						key={tab.key}
						onClick={() => onTabChange(tab.key)}
						className={`${
							activeTab === tab.key
								? "!border-purple-500 text-purple-600"
								: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
						} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm capitalize transition-colors`}>
						{tab.label}
					</button>
				))}
			</nav>
		</div>
	);
}
