import TopBar from "../components/TopBar";
import { Outlet, useLocation } from "react-router";
import ChatWidget from "../components/ChatBot/ChatWidget";

function Layout() {
  const location = useLocation();

  // Lấy courseId từ URL dạng /courses/:id/...
  const courseMatch = location.pathname.match(/^\/courses\/(\d+)/);
  const currentCourseId = courseMatch ? Number(courseMatch[1]) : undefined;
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
          selectedCourseId={currentCourseId}
          defaultOpen={false}
          position="right"
          zIndex={50}
          showLLMToggle={true}
          title="Chat Blog/Topic + Course"
        />
      </main>
    </div>
  );
}

export default Layout;
