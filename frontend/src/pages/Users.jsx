import UsersTable from "@/components/Users/UsersTable";
import { useAuth } from "@/contexts/AuthContext";
import { useUsersQuery } from "@/hooks/useUsersQuery";
import { Role } from "@/lib/constants";
import { useState } from "react";
import { Navigate, useOutletContext } from "react-router";

export function Users() {
	const { searchTerm } = useOutletContext();
	const { role } = useAuth();

	const [page, setPage] = useState(1);

	const { data, isLoading } = useUsersQuery({
		role: Role.USER,
		search: searchTerm,
		page,
	});

	if (role !== Role.ADMIN) return <Navigate to="/dashboard" />;
	if (isLoading) return <p>Loading...</p>;

	return <UsersTable data={data} setPage={setPage} />;
}

export function Creators() {
	const { searchTerm } = useOutletContext();
	const { role } = useAuth();

	const [page, setPage] = useState(1);

	const { data, isLoading } = useUsersQuery({
		role: Role.CREATOR,
		search: searchTerm,
		page,
	});

	if (role !== Role.ADMIN) return <Navigate to="/dashboard" />;
	if (isLoading) return <p>Loading...</p>;

	return <UsersTable data={data} setPage={setPage} />;
}

export function Admins() {
	const { searchTerm } = useOutletContext();
	const { role } = useAuth();

	const [page, setPage] = useState(1);

	const { data, isLoading } = useUsersQuery({
		role: Role.ADMIN,
		search: searchTerm,
		page,
	});

	if (role !== Role.ADMIN) return <Navigate to="/dashboard" />;
	if (isLoading) return <p>Loading...</p>;

	return <UsersTable data={data} setPage={setPage} />;
}

export function Stats() {
	return <div>Stats</div>;
}
