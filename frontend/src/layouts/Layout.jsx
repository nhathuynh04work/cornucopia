import TopBar from "../components/TopBar";
import { Outlet } from "react-router";

function Layout() {
	return (
		<div className="flex flex-col min-h-screen">
			{/* TopBar */}
			<TopBar />

			{/* Page content */}
			<main className="flex-1">
				<Outlet />
			</main>
		</div>
	);
}

export default Layout;
