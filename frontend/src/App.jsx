import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Confirm from "./pages/Confirm";
import Layout from "./layouts/Layout";
import Profile from "./pages/Profile";
import ProfileEdit from "./pages/ProfileEdit";
import ProfileInfo from "./pages/ProfileInfo";
import BlogDetail from "./pages/BlogDetail";
import TopicPage from "./pages/TopicPage";
import TestInfo from "./pages/TestInfo";
import { Explore, MyFlashcards } from "./pages/Flashcards";
import FlashcardsDetail from "./pages/FlashcardsDetail";
import ProfileSecurity from "./pages/ProfileSecurity";
import ProfileStats from "./pages/ProfileStats";
import AuthCallback from "./pages/AuthCallback";
import TestEdit from "./pages/TestEdit";
import TestAttempt from "./pages/TestAttempt";
import AttemptResult from "./pages/AttemptResult";
import FlashcardPractice from "./pages/FlashcardPractice";
import CourseInfo from "./pages/CourseInfo";
import CourseEdit from "./pages/CourseEdit";
import CourseLearn from "./pages/CourseLearn";
import CoursesLayout from "./layouts/CoursesLayout";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import TestsLayout from "./layouts/TestsLayout";
import FlashcardsLayout from "./layouts/FlashcardsLayout";
import { AllCourses, EnrolledCourses, MyCourses } from "./pages/Courses";
import { AllTests, AttemptedTests, MyTests } from "./pages/Tests";
import PostsLayout from "./layouts/PostsLayout";
import { AllPosts, MyDrafts, MyPosts } from "./pages/Posts";
import UsersLayout from "./layouts/UsersLayout";
import { Admins, Creators, Users } from "./pages/Users";
import BlogEdit from "./pages/BlogEdit";

function App() {
	return (
		<>
			<Routes>
				{/* --- Routes Inside Main Layout --- */}
				<Route element={<Layout />}>
					<Route index element={<Navigate to="dashboard" />} />
					<Route path="landing" element={<Landing />} />
					<Route path="dashboard" element={<Dashboard />} />
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
					<Route path="posts" element={<PostsLayout />}>
						<Route index element={<Navigate to="all" replace />} />
						<Route path="all" element={<AllPosts />} />
						<Route path="my" element={<MyPosts />} />
						<Route path="draft" element={<MyDrafts />} />
					</Route>
					<Route path="posts/:id" element={<BlogDetail />} />

					{/* Topic Routes */}
					<Route path="topics/:id" element={<TopicPage />} />

					{/* Test Routes */}
					<Route path="/tests" element={<TestsLayout />}>
						<Route index element={<Navigate to="all" replace />} />
						<Route path="all" element={<AllTests />} />
						<Route path="attempted" element={<AttemptedTests />} />
						<Route path="admin" element={<MyTests />} />
					</Route>
					<Route path="tests/:id" element={<TestInfo />} />

					{/* Flashcard Routes */}
					<Route path="flashcards" element={<FlashcardsLayout />}>
						<Route index element={<Navigate to="my" replace />} />
						<Route path="my" element={<MyFlashcards />} />
						<Route path="explore" element={<Explore />} />
					</Route>
					<Route
						path="flashcards/:listId/edit"
						element={<FlashcardsDetail />}
					/>
					<Route
						path="flashcards/:listId/practice"
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

					<Route path="/users" element={<UsersLayout />}>
						<Route index element={<Navigate to="normal" />} />
						<Route path="normal" element={<Users />} />
						<Route path="creators" element={<Creators />} />
						<Route path="admins" element={<Admins />} />
					</Route>

					{/* Other Routes */}
					<Route path="attempts/:id" element={<AttemptResult />} />
				</Route>

				{/* --- Routes Outside Main Layout --- */}
				<Route path="posts/:id/edit" element={<BlogEdit />} />
				<Route path="tests/:id/edit" element={<TestEdit />} />
				<Route path="tests/:id/attempt" element={<TestAttempt />} />
				<Route path="courses/:id/learn" element={<CourseLearn />} />
				<Route path="courses/:id/edit" element={<CourseEdit />} />
				<Route path="confirm" element={<Confirm />} />
				<Route path="auth/callback" element={<AuthCallback />} />

				<Route path="*" element={<Navigate to="/" />} />
			</Routes>

			{/* Toaster should be outside <Routes> */}
			<Toaster position="bottom-center" />
		</>
	);
}

export default App;
