import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import Avatar from "../components/Avatar";
import ProfileNavBar from "../components/ProfileNavBar";

const navItems = [
	{
		name: "Profile",
		subtitle: "View your profile",
		to: "/profile",
	},
	{
		name: "Edit Profile",
		subtitle: "Update your information",
		to: "/profile/edit",
	},
	{
		name: "Security",
		subtitle: "Manage security settings",
		to: "/profile/security",
	},
	{
		name: "Statistics",
		subtitle: "View your stats",
		to: "/profile/stats",
	},
];

function Profile() {
	const { user } = useAuth();
	const location = useLocation();

	if (!user) {
		return <Navigate to="/" />;
	}

	const currentItem = navItems.find((item) => location.pathname === item.to);

	return (
		<div className="p-6">
			<div className="w-5/6 mx-auto grid grid-cols-10 grid-rows-3 border border-gray-300">
				<div className="col-span-2 row-span-3 flex flex-col items-center border-r border-gray-300">
					<div className="p-4 flex flex-col items-center space-y-2">
						<Avatar size="lg" />
						<span className="font-semibold text-lg">
							{user.name}
						</span>
					</div>
					<ProfileNavBar navItems={navItems} />
				</div>
				<div className="col-span-8 col-start-3 border-b border-gray-300 flex flex-col space-y-2 items-center justify-center h-full">
					<h1 className="font-medium text-2xl">{currentItem.name}</h1>
					<span className="font-extralight">
						{currentItem.subtitle}
					</span>
				</div>
				<div className="col-span-8 row-span-2 col-start-3 row-start-2">
					<Outlet />
				</div>
			</div>
		</div>
	);
}

export default Profile;
