import { useState } from "react";
import Modal from "../components/Modal";
import CreateTestForm from "../components/CreateTestForm";
import { api } from "../apis/axios.js";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchTests } from "../apis/testApi.js";
import NavButton from "../components/NavButton.jsx";

function Tests() {
	const { data: tests, isLoading } = useQuery({
		queryKey: ["tests"],
		queryFn: fetchTests,
	});
	const [showModal, setShowModal] = useState(false);
	const navigate = useNavigate();

	async function handleCreateTest({ title, description }) {
		const res = await api.post("/tests", {
			title,
			description,
		});

		const id = res.data.test.id;
		navigate(`/tests/${id}/edit`);
	}

	if (isLoading) {
		return <p>Loading...</p>;
	}

	if (tests.length === 0) {
		return <p>No test</p>;
	}

	return (
		<>
			<div className="flex">
				<div className="w-5/6">
					<h1>Tests</h1>
					<div className="grid grid-cols-5 gap-4">
						{tests.map((test) => (
							<NavButton
								to={`/tests/${test.id}`}
								key={test.id}
								className="bg-red-100">
								{test.title}
							</NavButton>
						))}
					</div>
				</div>

				<div className="w-1/6">
					<button
						onClick={() => setShowModal(true)}
						className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 transition">
						New Test
					</button>
				</div>
			</div>

			{showModal && (
				<Modal onClose={() => setShowModal(false)}>
					<h2 className="text-xl font-semibold text-gray-800 mb-4">
						Create New Test
					</h2>
					<CreateTestForm
						onSubmit={handleCreateTest}
						onCancel={() => setShowModal(false)}
					/>
				</Modal>
			)}
		</>
	);
}

export default Tests;
