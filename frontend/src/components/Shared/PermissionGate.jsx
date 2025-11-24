import { useAuth } from "@/contexts/AuthContext";

export const PermissionGate = ({ children, allowedRoles = [] }) => {
	const { user } = useAuth();

	if (!user || !allowedRoles.includes(user.role)) {
		return null;
	}

	return children;
};

export default PermissionGate;
