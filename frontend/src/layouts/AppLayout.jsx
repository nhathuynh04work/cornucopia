import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import {
	LayoutDashboard,
	BookOpen,
	Layers,
	LogOut,
	Menu,
	X,
	ChevronLeft,
	ChevronRight,
	Users,
	FileQuestion,
	FileText,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Logo from "@/components/Shared/Logo";
import { Role } from "@/lib/constants";
import Avatar from "@/components/Shared/Avatar";
import ChatWidget from "@/components/ChatWidget/ChatWidget";

function AppLayout() {
	const { logout, user, role } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isCollapsed, setIsCollapsed] = useState(false);

	const navItems = [
		{ label: "Tổng quan", icon: LayoutDashboard, path: "/dashboard" },
		{ label: "Khóa học", icon: BookOpen, path: "/courses" },
		{ label: "Bộ thẻ", icon: Layers, path: "/decks" },
		{ label: "Bài kiểm tra", icon: FileQuestion, path: "/tests" },
		{ label: "Bài viết", icon: FileText, path: "/posts" },
	];

	if (role === Role.ADMIN) {
		const hasUsersLink = navItems.some((item) => item.path === "/users");
		if (!hasUsersLink) {
			navItems.splice(1, 0, {
				label: "Người dùng",
				icon: Users,
				path: "/users",
			});
		}
	}

	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	return (
		<div className="min-h-screen bg-gray-50 flex">
			{/* Sidebar - Desktop */}
			<aside
				className={`hidden lg:flex flex-col bg-white border-r border-gray-100 fixed inset-y-0 z-50 transition-all duration-300 ease-in-out ${
					isCollapsed ? "w-20" : "w-64"
				}`}>
				{/* Toggle Button */}
				<button
					onClick={() => setIsCollapsed(!isCollapsed)}
					className="absolute -right-3 top-9 bg-white border border-gray-200 rounded-full p-1.5 text-gray-500 hover:text-purple-600 hover:border-purple-200 shadow-sm transition-all z-50">
					{isCollapsed ? (
						<ChevronRight className="w-3.5 h-3.5" />
					) : (
						<ChevronLeft className="w-3.5 h-3.5" />
					)}
				</button>

				{/* Logo Area */}
				<div
					className={`h-20 flex items-center border-b border-gray-50 ${
						isCollapsed ? "justify-center px-0" : "px-6"
					}`}>
					<Link
						to="/dashboard"
						className="flex items-center gap-2 overflow-hidden group">
						<Logo
							showText={!isCollapsed}
							className={`transition-all duration-200 ${
								isCollapsed ? "scale-110" : ""
							}`}
						/>
					</Link>
				</div>

				{/* Nav Items */}
				<nav className="flex-1 p-3 space-y-1 overflow-y-auto overflow-x-hidden">
					{navItems.map((item) => {
						const isActive =
							location.pathname === item.path ||
							(item.path !== "/dashboard" &&
								location.pathname.startsWith(item.path));

						return (
							<Link
								key={item.path}
								to={item.path}
								title={isCollapsed ? item.label : ""}
								className={`flex items-center gap-3 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
									isCollapsed ? "justify-center px-2" : "px-4"
								} ${
									isActive
										? "bg-purple-50 text-purple-700"
										: "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
								}`}>
								<item.icon
									className={`w-5 h-5 flex-shrink-0 ${
										isActive
											? "text-purple-600"
											: "text-gray-400"
									}`}
								/>
								<span
									className={`transition-all duration-200 ${
										isCollapsed
											? "opacity-0 w-0 hidden"
											: "opacity-100"
									}`}>
									{item.label}
								</span>
							</Link>
						);
					})}
				</nav>

				{/* User Footer (Sidebar) */}
				<div className="p-3 border-t border-gray-50">
					{/* Changed div to Link and added hover effect */}
					<Link
						to="/profile/me"
						className={`flex items-center gap-3 py-2 mb-2 rounded-xl transition-colors hover:bg-purple-50 group cursor-pointer ${
							isCollapsed
								? "justify-center"
								: "px-3 bg-gray-50/50"
						}`}>
						<Avatar url={user?.avatarUrl} name={user?.name} />
						{!isCollapsed && (
							<div className="flex-1 min-w-0 animate-in fade-in duration-200">
								<p className="text-sm font-medium text-gray-900 truncate group-hover:text-purple-700 transition-colors">
									{user?.name}
								</p>
								<p className="text-xs text-gray-500 truncate">
									{user?.email}
								</p>
							</div>
						)}
					</Link>
					<button
						onClick={handleLogout}
						title={isCollapsed ? "Đăng xuất" : ""}
						className={`flex w-full items-center gap-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors ${
							isCollapsed ? "justify-center px-2" : "px-4"
						}`}>
						<LogOut className="w-5 h-5 flex-shrink-0" />
						{!isCollapsed && <span>Đăng xuất</span>}
					</button>
				</div>
			</aside>

			{/* Mobile Header */}
			<div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 z-40">
				<Link to="/">
					<Logo iconSize="w-8 h-8" textSize="text-lg" />
				</Link>
				<button
					onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
					className="p-2 text-gray-600">
					{isMobileMenuOpen ? (
						<X className="w-6 h-6" />
					) : (
						<Menu className="w-6 h-6" />
					)}
				</button>
			</div>

			{/* Mobile Menu Overlay */}
			{isMobileMenuOpen && (
				<div className="lg:hidden fixed inset-0 z-30 bg-white pt-16">
					<nav className="p-4 space-y-2">
						{/* Add Profile Link to Mobile Menu as well for consistency */}
						<Link
							to="/profile/me"
							onClick={() => setIsMobileMenuOpen(false)}
							className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-900 bg-gray-50 hover:bg-gray-100 mb-4">
							<Avatar
								url={user?.avatarUrl}
								name={user?.name}
								size="xs"
							/>
							<span>{user?.name}</span>
						</Link>

						{navItems.map((item) => (
							<Link
								key={item.path}
								to={item.path}
								onClick={() => setIsMobileMenuOpen(false)}
								className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">
								<item.icon className="w-5 h-5" />
								{item.label}
							</Link>
						))}
						<button
							onClick={handleLogout}
							className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl">
							<LogOut className="w-5 h-5" />
							Đăng xuất
						</button>
					</nav>
				</div>
			)}

			{/* Main Content Area */}
			<main
				className={`flex-1 p-4 lg:p-8 pt-20 lg:pt-8 transition-all duration-300 ease-in-out flex flex-col ${
					isCollapsed ? "lg:ml-20" : "lg:ml-64"
				}`}>
				<div className="max-w-6xl mx-auto w-full flex-1">
					<Outlet />
				</div>
			</main>

			<ChatWidget />
		</div>
	);
}

export default AppLayout;
