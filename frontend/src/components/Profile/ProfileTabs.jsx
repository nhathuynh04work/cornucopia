import RadixSelect from "../Shared/RadixSelect";

export default function ProfileTabs({ tabs, activeTab, onTabChange }) {
	// Prepare options for the mobile dropdown
	const selectOptions = tabs.map((tab) => ({
		value: tab.id,
		label: tab.label,
	}));

	// Find the active tab object to display its icon in the dropdown
	const activeTabObj = tabs.find((t) => t.id === activeTab);

	return (
		<div className="w-full">
			{/* Mobile View: Dropdown Select */}
			<div className="md:hidden pb-2 border-b border-gray-200">
				<RadixSelect
					value={activeTab}
					onChange={onTabChange}
					options={selectOptions}
					className="w-full"
					icon={
						activeTabObj?.icon ? (
							<activeTabObj.icon className="w-4 h-4" />
						) : null
					}
				/>
			</div>

			{/* Desktop View: Horizontal Tabs (Hidden on mobile) */}
			<div className="hidden md:flex border-b border-gray-200 overflow-x-auto hide-scrollbar">
				{tabs.map((tab) => (
					<button
						key={tab.id}
						onClick={() => onTabChange(tab.id)}
						className={`flex items-center gap-2 px-5 py-3 text-sm font-bold whitespace-nowrap transition-all border-b-2 -mb-px ${
							activeTab === tab.id
								? "border-purple-600 text-purple-700"
								: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
						}`}>
						<tab.icon className="w-4 h-4" />
						{tab.label}
						{tab.count !== undefined && (
							<span
								className={`ml-1 text-[10px] py-0.5 px-2 rounded-full ${
									activeTab === tab.id
										? "bg-purple-100 text-purple-700"
										: "bg-gray-100 text-gray-500"
								}`}>
								{tab.count}
							</span>
						)}
					</button>
				))}
			</div>
		</div>
	);
}
