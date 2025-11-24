import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, ArrowRight, Loader2, Globe } from "lucide-react";
import authApi from "@/apis/authApi";
import { toast } from "react-hot-toast";
import { env } from "@/env";

export default function Signup() {
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		formState: { isSubmitting, errors },
	} = useForm();

	async function onSubmit(data) {
		try {
			await authApi.signup(data);
			toast.success("Tạo tài khoản thành công! Vui lòng đăng nhập.");
			navigate("/login");
		} catch (error) {
			toast.error(error.message || "Đăng ký thất bại");
		}
	}

	const handleGoogleSignup = () => {
		window.location.href = `${env.API_URL}/auth/google`;
	};

	return (
		<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
			<div className="text-center mb-10">
				<h1 className="text-3xl font-extrabold text-gray-900 mb-2">
					Tạo tài khoản mới
				</h1>
				<p className="text-gray-500">
					Bắt đầu hành trình học tập của bạn ngay hôm nay.
				</p>
			</div>

			<button
				onClick={handleGoogleSignup}
				type="button"
				className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-700 font-bold py-3 px-4 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm mb-6">
				<Globe className="w-5 h-5 text-red-500" />
				<span>Đăng ký với Google</span>
			</button>

			<div className="relative flex py-2 items-center mb-6">
				<div className="flex-grow border-t border-gray-100"></div>
				<span className="flex-shrink-0 mx-4 text-gray-400 text-xs uppercase tracking-wider">
					Hoặc đăng ký bằng Email
				</span>
				<div className="flex-grow border-t border-gray-100"></div>
			</div>

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
				{/* Name Field */}
				<div className="space-y-1.5">
					<label className="text-sm font-bold text-gray-700 ml-1">
						Họ tên
					</label>
					<div className="relative group">
						<User className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-purple-500 transition-colors" />
						<input
							{...register("name", {
								required: "Vui lòng nhập họ tên",
								minLength: {
									value: 2,
									message: "Tên quá ngắn",
								},
							})}
							type="text"
							placeholder="Nguyễn Văn A"
							className={`w-full pl-12 pr-4 py-3.5 rounded-xl border bg-gray-50 text-gray-900 placeholder:text-gray-400 outline-none focus:bg-white focus:ring-4 transition-all ${
								errors.name
									? "border-red-200 focus:border-red-500 focus:ring-red-100"
									: "border-gray-200 focus:border-purple-500 focus:ring-purple-100"
							}`}
						/>
					</div>
					{errors.name && (
						<p className="text-red-500 text-xs ml-1">
							{errors.name.message}
						</p>
					)}
				</div>

				{/* Email Field */}
				<div className="space-y-1.5">
					<label className="text-sm font-bold text-gray-700 ml-1">
						Email
					</label>
					<div className="relative group">
						<Mail className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-purple-500 transition-colors" />
						<input
							{...register("email", {
								required: "Vui lòng nhập email",
								pattern: {
									value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
									message: "Email không hợp lệ",
								},
							})}
							type="email"
							placeholder="name@example.com"
							className={`w-full pl-12 pr-4 py-3.5 rounded-xl border bg-gray-50 text-gray-900 placeholder:text-gray-400 outline-none focus:bg-white focus:ring-4 transition-all ${
								errors.email
									? "border-red-200 focus:border-red-500 focus:ring-red-100"
									: "border-gray-200 focus:border-purple-500 focus:ring-purple-100"
							}`}
						/>
					</div>
					{errors.email && (
						<p className="text-red-500 text-xs ml-1">
							{errors.email.message}
						</p>
					)}
				</div>

				{/* Password Field */}
				<div className="space-y-1.5">
					<label className="text-sm font-bold text-gray-700 ml-1">
						Mật khẩu
					</label>
					<div className="relative group">
						<Lock className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-purple-500 transition-colors" />
						<input
							{...register("password", {
								required: "Vui lòng tạo mật khẩu",
								minLength: {
									value: 8,
									message: "Mật khẩu tối thiểu 8 ký tự",
								},
							})}
							type="password"
							placeholder="••••••••"
							className={`w-full pl-12 pr-4 py-3.5 rounded-xl border bg-gray-50 text-gray-900 placeholder:text-gray-400 outline-none focus:bg-white focus:ring-4 transition-all ${
								errors.password
									? "border-red-200 focus:border-red-500 focus:ring-red-100"
									: "border-gray-200 focus:border-purple-500 focus:ring-purple-100"
							}`}
						/>
					</div>
					{errors.password && (
						<p className="text-red-500 text-xs ml-1">
							{errors.password.message}
						</p>
					)}
				</div>

				<button
					type="submit"
					disabled={isSubmitting}
					className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-purple-200 hover:shadow-xl hover:shadow-purple-300 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:transform-none">
					{isSubmitting ? (
						<Loader2 className="w-5 h-5 animate-spin" />
					) : (
						<>
							Tạo tài khoản <ArrowRight className="w-5 h-5" />
						</>
					)}
				</button>
			</form>

			<p className="mt-8 text-center text-sm text-gray-500">
				Đã có tài khoản?{" "}
				<Link
					to="/login"
					className="font-bold text-purple-600 hover:text-purple-700 hover:underline">
					Đăng nhập
				</Link>
			</p>
		</div>
	);
}
