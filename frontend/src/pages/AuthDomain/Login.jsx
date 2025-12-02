import { useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router";
import { Mail, Lock, ArrowRight, Loader2, Globe } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-hot-toast";
import { env } from "@/env";
import SEO from "@/components/Shared/SEO";

export default function Login() {
	const { login } = useAuth();
	const [searchParams, setSearchParams] = useSearchParams();

	if (searchParams.get("error") === "blocked") {
		toast.error(
			"Tài khoản của bạn đã bị chặn. Hãy liên hệ chúng tôi để xử lý!",
			{ id: "blocked_error" }
		);

		const newSearchParams = new URLSearchParams(searchParams);
		newSearchParams.delete("error");
		setSearchParams(newSearchParams, { replace: true });
	}

	const {
		register,
		handleSubmit,
		formState: { isSubmitting, errors },
	} = useForm();

	async function onSubmit(data) {
		try {
			await login(data);
			toast.success("Đăng nhập thành công!");
		} catch (error) {
			toast.error(error.message || "Đăng nhập thất bại");
		}
	}

	const handleGoogleLogin = () => {
		window.location.href = `${env.API_URL}/auth/google`;
	};

	return (
		<>
			<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
				<div className="text-center mb-10">
					<h1 className="text-3xl font-extrabold text-gray-900 mb-2">
						Chào mừng trở lại!
					</h1>
					<p className="text-gray-500">
						Nhập thông tin để truy cập tài khoản của bạn.
					</p>
				</div>

				{/* Google Login */}
				<button
					onClick={handleGoogleLogin}
					type="button"
					className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-700 font-bold py-3 px-4 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm mb-6">
					<Globe className="w-5 h-5 text-red-500" />
					<span>Tiếp tục với Google</span>
				</button>

				<div className="relative flex py-2 items-center mb-6">
					<div className="flex-grow border-t border-gray-100"></div>
					<span className="flex-shrink-0 mx-4 text-gray-400 text-xs uppercase tracking-wider">
						Hoặc đăng nhập bằng Email
					</span>
					<div className="flex-grow border-t border-gray-100"></div>
				</div>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
						<div className="flex justify-between items-center ml-1">
							<label className="text-sm font-bold text-gray-700">
								Mật khẩu
							</label>
							<Link
								to="/forgot-password"
								class="text-xs font-semibold text-purple-600 hover:text-purple-700 hover:underline">
								Quên mật khẩu?
							</Link>
						</div>
						<div className="relative group">
							<Lock className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-purple-500 transition-colors" />
							<input
								{...register("password", {
									required: "Vui lòng nhập mật khẩu",
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
								Đăng nhập <ArrowRight className="w-5 h-5" />
							</>
						)}
					</button>
				</form>

				<p className="mt-8 text-center text-sm text-gray-500">
					Chưa có tài khoản?{" "}
					<Link
						to="/signup"
						className="font-bold text-purple-600 hover:text-purple-700 hover:underline">
						Đăng ký ngay
					</Link>
				</p>
			</div>

			<SEO title={"Đăng nhập"} description="Đăng nhập vào tài khoản của bạn" />
		</>
	);
}
