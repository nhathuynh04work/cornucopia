import { Navigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";

function Profile() {
	const { user } = useAuth();

	if (!user) {
		return <Navigate to="/" />;
	}

	return <div>Profile</div>;
}

export default Profile;
