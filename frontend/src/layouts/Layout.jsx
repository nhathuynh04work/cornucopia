import NavBar from "../components/NavBar";
import { Outlet } from "react-router";

function Layout() {
	return (
		<div className="flex flex-col min-h-screen">
			{/* Navbar */}
			<NavBar />

			{/* Page content */}
			<main className="flex-1 p-6">
				<Outlet />
			</main>
		</div>
	);
}

export default Layout;
