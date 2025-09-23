import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Confirm from "./pages/Confirm";
import Layout from "./layouts/Layout";
import Profile from "./pages/Profile";
import ProfileEdit from "./pages/ProfileEdit";
import Blog from "./pages/Blog";
import Tests from "./pages/Tests";
import Flashcards from "./pages/Flashcards";
import Courses from "./pages/Courses";
import { Toaster } from "react-hot-toast";

function App() {
	return (
		<>
			<Routes>
				<Route element={<Layout />}>
					<Route index element={<Home />} />
					<Route path="signup" element={<Signup />} />
					<Route path="login" element={<Login />} />
					<Route path="profile" element={<Profile />}>
						<Route path="edit" element={<ProfileEdit />} />
					</Route>
					<Route path="blog" element={<Blog />} />
					<Route path="tests" element={<Tests />} />
					<Route path="flashcards" element={<Flashcards />} />
					<Route path="courses" element={<Courses />} />
				</Route>
				<Route path="confirm" element={<Confirm />} />
			</Routes>

			<Toaster position="bottom-left" />
		</>
	);
}

export default App;
