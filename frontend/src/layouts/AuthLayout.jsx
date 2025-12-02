import { Link, Outlet } from "react-router-dom";
import Logo from "@/components/Shared/Logo";

export default function AuthLayout() {
	return (
		<div className="min-h-screen flex bg-white">
			{/* Left Side - Hero / Brand (Hidden on mobile) */}
			<div className="hidden lg:flex lg:w-1/2 bg-purple-50 relative items-center justify-center overflow-hidden">
				{/* Decorative blobs */}
				<div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-30"></div>
				<div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-30"></div>

				<div className="relative z-10 max-w-lg text-center p-12">
					<img
						src="/login-hero.svg"
						alt="Welcome"
						className="w-full h-auto mb-8 drop-shadow-xl"
					/>
					<h2 className="text-3xl font-extrabold text-gray-900 mb-4">
						Học tập không giới hạn
					</h2>
					<p className="text-gray-500 text-lg">
						Tham gia cùng hàng ngàn người học khác trên hành trình
						chinh phục tri thức với Cornucopia.
					</p>
				</div>
			</div>

			{/* Right Side - Form Content */}
			<div className="w-full lg:w-1/2 flex flex-col">
				{/* Header (Logo) */}
				<div className="p-6 flex justify-between items-center">
					<Link to="/">
						<Logo />
					</Link>
				</div>

				{/* Main Form Area */}
				<div className="flex-1 flex items-center justify-center p-6 sm:p-12">
					<div className="w-full max-w-md space-y-8">
						<Outlet />
					</div>
				</div>

				{/* Simple Footer */}
				<div className="p-6 text-center text-xs text-gray-400">
					© {new Date().getFullYear()} Cornucopia Inc.
				</div>
			</div>
		</div>
	);
}
