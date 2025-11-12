import TabsSearchbarLayout from "./TabSearchbarLayout";

const TABS = {
	USERS: { title: "Users", key: "users", path: "/users/normal" },
	CREATORS: { title: "Creators", key: "creators", path: "/users/creators" },
	ADMINS: { title: "Admins", key: "admins", path: "/users/admins" },
	STATISTICS: { title: "Statistics", key: "stats", path: "/users/stats" },
};

function UsersLayout() {
	const tabs = Object.values(TABS);

	return (
		<TabsSearchbarLayout tabs={tabs} searchPlaceholder="Search users..." />
	);
}

export default UsersLayout;
