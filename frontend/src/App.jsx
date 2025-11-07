import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router";
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
import TestInfo from "./pages/TestInfo";
import Flashcards from "./pages/Flashcards";
import FlashcardsDetail from "./pages/FlashcardsDetail";
import ProfileSecurity from "./pages/ProfileSecurity";
import ProfileStats from "./pages/ProfileStats";
import AuthCallback from "./pages/AuthCallback";
import TestEdit from "./pages/TestEdit";
import TestAttempt from "./pages/TestAttempt";
import AttemptResult from "./pages/AttemptResult";
import FlashcardPractice from "./components/FlashCard/FlashcardPractice";
import CourseInfo from "./pages/CourseInfo";
import CourseEdit from "./pages/CourseEdit";
import CourseLearn from "./pages/CourseLearn";
import AllCourses from "./pages/AllCourses";
import EnrolledCourses from "./pages/EnrolledCourses";
import MyCourses from "./pages/MyCourses";
import CoursesLayout from "./layouts/CoursesLayout";

function App() {
	return (
		<>
			<Routes>
				{/* --- Routes Inside Main Layout --- */}
				<Route element={<Layout />}>
					<Route index element={<Home />} />
					<Route path="signup" element={<Signup />} />
					<Route path="login" element={<Login />} />

					{/* Profile Routes */}
					<Route path="profile" element={<Profile />}>
						<Route index element={<ProfileInfo />} />
						<Route path="edit" element={<ProfileEdit />} />
						<Route path="security" element={<ProfileSecurity />} />
						<Route path="stats" element={<ProfileStats />} />
					</Route>

					{/* Blog Routes */}
					<Route path="blog" element={<Blog />} />
					<Route path="blog/:id" element={<BlogDetail />} />
					<Route path="blog/:id/:slug" element={<BlogDetail />} />
					<Route path="blog/:id/edit" element={<BlogEditor />} />

					{/* Topic Routes */}
					<Route path="topics/:slug" element={<TopicPage />} />

					{/* Test Routes */}
					<Route path="tests" element={<Tests />} />
					<Route path="tests/:id" element={<TestInfo />} />

					{/* Flashcard Routes */}
					<Route path="flashcards" element={<Flashcards />} />
					<Route
						path="lists/:listId/edit"
						element={<FlashcardsDetail />}
					/>
					<Route
						path="lists/:listId/practice"
						element={<FlashcardPractice />}
					/>

					{/* Courses Routes */}
					<Route path="/courses" element={<CoursesLayout />}>
						<Route index element={<Navigate to="all" replace />} />
						<Route path="all" element={<AllCourses />} />
						<Route path="enrolled" element={<EnrolledCourses />} />
						<Route path="admin" element={<MyCourses />} />
					</Route>
					<Route path="courses/:id" element={<CourseInfo />} />

					{/* Other Routes */}
					<Route path="attempts/:id" element={<AttemptResult />} />
				</Route>

				{/* --- Routes Outside Main Layout --- */}
				<Route path="tests/:id/edit" element={<TestEdit />} />
				<Route path="tests/:id/attempt" element={<TestAttempt />} />
				<Route path="courses/:id/learn" element={<CourseLearn />} />
				<Route path="courses/:id/edit" element={<CourseEdit />} />
				<Route path="confirm" element={<Confirm />} />
				<Route path="auth/callback" element={<AuthCallback />} />
			</Routes>

			{/* Toaster should be outside <Routes> */}
			<Toaster position="bottom-center" />
		</>
	);
}

export default App;
