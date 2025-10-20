import { settingsMenu } from "@/lib/test-settings.config";

function ModalSidebar({ currentTab, onTabChange }) {
	return (
		<aside className="w-1/4 flex flex-col text-sm text-gray-700 pr-2">
			<nav className="space-y-1">
				{settingsMenu.map((tab) => (
					<button
						key={tab.key}
						type="button" 
						onClick={() => onTabChange(tab.key)}
						className={`w-full text-left rounded-md py-3 px-4 transition ${
							currentTab === tab.key
								? "bg-gray-200 font-medium text-gray-800" 
								: "hover:bg-gray-200"
						}`}>
						{tab.label}
					</button>
				))}
			</nav>
		</aside>
	);
}

export default ModalSidebar;
