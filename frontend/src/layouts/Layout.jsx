import TopBar from "../components/TopBar";
import { Outlet } from "react-router";
import ChatWidget from "../components/ChatBot/ChatWidget";

function Layout() {
	return (
		<div className="flex flex-col min-h-screen overflow-hidden">
			{/* TopBar */}
			<TopBar />

			{/* Page content */}
			<main className="h-[calc(100vh-64px)] overflow-y-auto">
				<Outlet />

				{/* Floating Chat – hiện toàn site */}
				<ChatWidget
					selectedTopic=""
					defaultOpen={false}
					position="right"
					zIndex={50}
					showLLMToggle={true}
					title="Chat Blog/Topic"
				/>
			</main>
		</div>
	);
}

export default Layout;
