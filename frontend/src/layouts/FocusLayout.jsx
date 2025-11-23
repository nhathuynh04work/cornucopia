import { Outlet } from "react-router-dom";

function FocusLayout() {
	return (
		<div className="min-h-screen bg-white text-gray-900 flex flex-col">
			<main className="flex-1 relative">
				<Outlet />
			</main>
		</div>
	);
}

export default FocusLayout;
