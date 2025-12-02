import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { ClipLoader } from "react-spinners";
import { useAuth } from "@/contexts/AuthContext";
import authApi from "@/apis/authApi";

function Confirm() {
	const location = useLocation();
	const params = new URLSearchParams(location.search);
	const confirmToken = params.get("token");

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const { setAuthenticatedSession } = useAuth();

	async function confirm() {
		setLoading(true);

		try {
			const token = await authApi.confirmEmail(confirmToken);
			await setAuthenticatedSession(token);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}

	// Confirm on mount
	useEffect(() => {
		confirm();
	}, []);

	if (loading)
		return (
			<div className="flex justify-center items-center h-screen">
				<p className="text-lg text-gray-700">
					Confirming your email...
				</p>
				<ClipLoader />
			</div>
		);

	if (error)
		return (
			<div className="flex flex-col justify-center items-center h-screen gap-6 p-4 text-center">
				<div className="max-w-md w-full bg-red-50 border border-red-200 rounded-lg p-6 shadow-sm">
					<h2 className="text-xl font-semibold text-red-800 mb-3">
						Confirmation Failed
					</h2>
					<p className="text-red-700">{error}</p>
				</div>
				<Link
					to="/"
					className="px-5 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors duration-150">
					Back to Home
				</Link>
			</div>
		);

	return null;
}

export default Confirm;
