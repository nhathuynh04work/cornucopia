import { Search } from "lucide-react";
import { NavLink, Outlet, useSearchParams } from "react-router";

export default function TabsSearchbarLayout({
	tabs,
	searchPlaceholder = "Search...",
}) {
	const [searchParams, setSearchParams] = useSearchParams();
	const searchTerm = searchParams.get("q") || "";

	const handleSearchChange = (e) => {
		const q = e.target.value;
		if (q) {
			setSearchParams({ q }, { replace: true });
		} else {
			setSearchParams({}, { replace: true });
		}
	};

	return (
		<div className="p-6 bg-white w-5/6 mx-auto">
			<Header
				tabs={tabs}
				searchTerm={searchTerm}
				onSearchChange={handleSearchChange}
				searchPlaceholder={searchPlaceholder}
			/>
			<div className="mt-6">
				<Outlet context={{ searchTerm }} />
			</div>
		</div>
	);
}

function Header({ tabs, searchTerm, onSearchChange, searchPlaceholder }) {
	return (
		<div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
			<div className="flex-shrink-0">
				<nav className="flex space-x-1" aria-label="Tabs">
					{tabs.map((tab) => (
						<NavLink
							key={tab.key}
							to={tab.path}
							className={({ isActive }) =>
								`px-4 py-2 text-sm rounded-md ${
									isActive
										? "bg-purple-100 text-purple-700"
										: "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
								}`
							}>
							{tab.title}
						</NavLink>
					))}
				</nav>
			</div>

			<div className="relative w-full md:w-auto md:max-w-xs">
				<span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
					<Search className="w-3.5 h-3.5 text-gray-400" />
				</span>
				<input
					type="text"
					placeholder={searchPlaceholder}
					value={searchTerm}
					onChange={onSearchChange}
					className="block text-sm w-full pl-10 pr-4 py-2 border !border-gray-300 rounded-md shadow-sm focus:!ring-purple-500 focus:!border-purple-500"
				/>
			</div>
		</div>
	);
}
