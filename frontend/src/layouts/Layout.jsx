import TopBar from "../components/TopBar";
import { Outlet } from "react-router";
import ChatWidget from "../components/ChatBot/ChatWidget";
function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* TopBar */}
      <TopBar />

      {/* Page content */}
      <main className="flex-1">
        <Outlet />
        {/* Floating Chat – hiện toàn site */}
        <ChatWidget
          selectedTopic="" // hoặc "ielts" nếu muốn cố định theo topic
          defaultOpen={false}
          position="right" // "left" nếu muốn trái
          zIndex={50}
          showLLMToggle={true}
          title="Chat Blog/Topic"
        />
      </main>
    </div>
  );
}

export default Layout;
