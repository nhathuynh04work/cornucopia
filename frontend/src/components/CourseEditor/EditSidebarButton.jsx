function EditSidebarButton({ children, icon, isActive, onClick }) {
	return (
		<button
			onClick={onClick}
			className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium ${
				isActive
					? "bg-purple-100 text-purple-700"
					: "text-gray-600 hover:bg-gray-100"
			}`}>
			{icon}
			{children}
		</button>
	);
}

export default EditSidebarButton;
