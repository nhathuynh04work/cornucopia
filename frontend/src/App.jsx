import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Confirm from "./pages/Confirm";
import Layout from "./layouts/Layout";
import Profile from "./pages/Profile";
import ProfileEdit from "./pages/ProfileEdit";
import ProfileInfo from "./pages/ProfileInfo";
import Blog from "./pages/Blog";
import BlogEditor from "./pages/BlogEditor";
import BlogDetail from "./pages/BlogDetail";
import TopicPage from "./pages/TopicPage";
import Tests from "./pages/Tests";
import Flashcards from "./pages/Flashcards";
import FlashcardsDetail from "./pages/FlashcardsDetail";
import Courses from "./pages/Courses";
import ProfileSecurity from "./pages/ProfileSecurity";
import ProfileStats from "./pages/ProfileStats";
import AuthCallback from "./pages/AuthCallback";
import TestEdit from "./pages/TestEdit";
import TestInfo from "./pages/TestInfo";
import FlashcardPractice from "./components/FlashcardPractice";
import TestAttempt from "./pages/TestAttempt";
import AttemptResult from "./pages/AttemptResult";

function App() {
	return (
		<>
			<Routes>
				<Route element={<Layout />}>
					<Route index element={<Home />} />
					<Route path="signup" element={<Signup />} />
					<Route path="login" element={<Login />} />
					<Route path="profile" element={<Profile />}>
						<Route index element={<ProfileInfo />} />
						<Route path="edit" element={<ProfileEdit />} />
						<Route path="security" element={<ProfileSecurity />} />
						<Route path="stats" element={<ProfileStats />} />
					</Route>
					<Route path="blog" element={<Blog />} />
					<Route path="blog/:id" element={<BlogDetail />} />
					<Route path="blog/:id/:slug" element={<BlogDetail />} />
					<Route path="blog/:id/edit" element={<BlogEditor />} />
					<Route path="topics/:slug" element={<TopicPage />} />
					<Route path="tests" element={<Tests />} />
					<Route path="tests/:id" element={<TestInfo />} />
					<Route path="flashcards" element={<Flashcards />} />
					<Route path="courses" element={<Courses />} />
					<Route path="attempts/:id" element={<AttemptResult />} />
				</Route>
				<Route path="tests/:id/edit" element={<TestEdit />} />
				<Route path="tests/:id/attempt" element={<TestAttempt />} />
				<Route path="confirm" element={<Confirm />} />
				<Route path="auth/callback" element={<AuthCallback />} />

				<Route path="flashcards" element={<Flashcards />} />
				<Route
					path="lists/:listId/edit"
					element={<FlashcardsDetail />}
				/>

				<Route
					path="/lists/:listId/practice"
					element={<FlashcardPractice />}
				/>
			</Routes>

			<Toaster position="bottom-center" />
		</>
	);
}

export default App;
