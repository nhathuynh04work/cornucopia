import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Confirm from "./pages/Confirm";
import Layout from "./layouts/Layout";

function App() {
	return (
		<Routes>
			<Route element={<Layout />}>
				<Route index element={<Home />} />
				<Route path="signup" element={<Signup />} />
				<Route path="login" element={<Login />} />
			</Route>
			<Route path="confirm" element={<Confirm />} />
		</Routes>
	);
}

export default App;
