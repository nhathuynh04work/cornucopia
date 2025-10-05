function ModalSidebar() {
	return (
		<aside className="w-1/4 flex flex-col text-sm text-gray-700 pr-2">
			<nav className="space-y-1">
				<button className="w-full text-left rounded-md py-3 px-4 bg-gray-200 font-medium text-gray-800">
					General
				</button>
				<button className="w-full text-left rounded-md py-3 px-4 hover:bg-gray-200 transition">
					Access & Scheduling
				</button>
				<button className="w-full text-left rounded-md py-3 px-4 hover:bg-gray-200 transition">
					Language
				</button>
			</nav>
		</aside>
	);
}

export default ModalSidebar;
