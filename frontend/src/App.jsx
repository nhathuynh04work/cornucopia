import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./contexts/AuthContext";

// Layouts
import AppLayout from "./layouts/AppLayout";
import FocusLayout from "./layouts/FocusLayout";
import AuthLayout from "./layouts/AuthLayout";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AuthCallback from "./pages/AuthCallback";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import CourseInfo from "./pages/CourseInfo";
import Decks from "./pages/Decks";
import DeckDetails from "./pages/DeckDetails";
import Tests from "./pages/Tests";
import TestInfo from "./pages/TestInfo";
import AttemptResult from "./pages/AttemptResult";
import Posts from "./pages/Posts";
import PostDetails from "./pages/PostDetails";
import Users from "./pages/Users";
import CourseLearn from "./pages/CourseLearn";
import CourseEdit from "./pages/CourseEdit";
import DeckEdit from "./pages/DeckEdit";
import StudySession from "./pages/StudySession";
import TestAttempt from "./pages/TestAttempt";
import TestEdit from "./pages/TestEdit";
import BlogEdit from "./pages/BlogEdit";
import PaymentCallback from "./pages/PaymentCallback";
import Confirm from "./pages/Confirm";

const ProtectedRoute = ({ children }) => {
	const { user, isInitialLoading } = useAuth();

	if (isInitialLoading)
		return (
			<div className="min-h-screen flex items-center justify-center">
				Loading...
			</div>
		);

	if (!user) return <Navigate to="/login" replace />;

	return children;
};

function App() {
	const { user } = useAuth();

	return (
		<>
			<Toaster position="top-center" />
			<Routes>
				{/* --- Public Root --- */}
				<Route
					path="/"
					element={
						user ? (
							<Navigate to="/dashboard" replace />
						) : (
							<Landing />
						)
					}
				/>

				{/* --- Auth Routes (Split Layout) --- */}
				<Route element={<AuthLayout />}>
					<Route path="/login" element={<Login />} />
					<Route path="/signup" element={<Signup />} />
				</Route>

				{/* --- Callbacks --- */}
				<Route path="/auth/callback" element={<AuthCallback />} />
				<Route path="/payment/callback" element={<PaymentCallback />} />
				<Route path="/confirm" element={<Confirm />} />

				{/* --- Protected App Routes (Sidebar Layout) --- */}
				<Route
					element={
						<ProtectedRoute>
							<AppLayout />
						</ProtectedRoute>
					}>
					<Route path="/dashboard" element={<Dashboard />} />

					<Route path="/courses" element={<Courses />} />
					<Route path="/courses/:courseId" element={<CourseInfo />} />

					<Route path="/decks" element={<Decks />} />
					<Route path="/decks/:deckId" element={<DeckDetails />} />

					<Route path="/tests" element={<Tests />} />
					<Route path="/tests/:testId" element={<TestInfo />} />
					<Route
						path="/tests/:testId/result/:attemptId"
						element={<AttemptResult />}
					/>

					<Route path="/posts" element={<Posts />} />
					<Route path="/posts/:postId" element={<PostDetails />} />

					<Route path="/users" element={<Users />} />
				</Route>

				{/* --- Protected Focus Routes (No Sidebar) --- */}
				<Route
					element={
						<ProtectedRoute>
							<FocusLayout />
						</ProtectedRoute>
					}>
					<Route
						path="/courses/:courseId/learn"
						element={<CourseLearn />}
					/>
					<Route
						path="/courses/:courseId/edit"
						element={<CourseEdit />}
					/>
					<Route
						path="/decks/:deckId/study/:sessionId"
						element={<StudySession />}
					/>
					<Route path="/decks/:deckId/edit" element={<DeckEdit />} />
					<Route
						path="/tests/:testId/take"
						element={<TestAttempt />}
					/>
					<Route path="/tests/:testId/edit" element={<TestEdit />} />
					<Route path="/posts/:postId/edit" element={<BlogEdit />} />
				</Route>
			</Routes>
		</>
	);
}

export default App;
