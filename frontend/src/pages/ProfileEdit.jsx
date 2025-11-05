import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { api } from "@/apis/axios";

function ProfileEdit() {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = useForm({
		defaultValues: {
			name: "",
			email: "",
			avatarUrl: "",
		},
	});

	const token = localStorage.getItem("token");

	// 🧩 Lấy thông tin user hiện tại khi mở trang
	useEffect(() => {
		const fetchUser = async () => {
			try {
				if (!token) return;
				const res = await api.get("/auth/me", {
					headers: { Authorization: `Bearer ${token}` },
				});

				// Điền dữ liệu vào form
				reset({
					name: res.data.name || "",
					email: res.data.email || "",
					avatarUrl: res.data.avatarUrl || "",
				});
			} catch (error) {
				console.error("❌ Error fetching user:", error);
			}
		};
		fetchUser();
	}, [reset, token]);

	// 🧩 Gửi request PATCH tới backend
	const onSubmit = async (data) => {
		try {
			const res = await api.patch(
				"/users/basic-infos",
				{
					name: data.name,
					avatarUrl: data.avatarUrl,
				},
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			console.log("✅ Updated user:", res.data.data);
			setTimeout(() => window.location.reload());
		} catch (error) {
			console.error("❌ Failed to update profile:", error);
			alert("❌ Cập nhật thất bại");
		}
	};

	return (
		<div className="py-6 w-3/4 mx-auto">
			<h2 className="text-xl font-semibold mb-4">Edit Profile</h2>

			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex flex-col gap-4"
				noValidate
			>
				{/* Name */}
				<div>
					<label className="block mb-1">Name</label>
					<input
						type="text"
						{...register("name", {
							required: "Vui lòng nhập tên.",
							minLength: { value: 2, message: "Tên quá ngắn." },
						})}
						className={`w-full border rounded-lg p-2 ${
							errors.name ? "border-red-500" : "border-gray-300"
						}`}
					/>
					{errors.name && (
						<p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
					)}
				</div>

				{/* Submit */}
				<button
					type="submit"
					disabled={isSubmitting}
					className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg disabled:opacity-50"
				>
					{isSubmitting ? "Đang cập nhật..." : "Cập nhật"}
				</button>
			</form>
		</div>
	);
}

export default ProfileEdit;
