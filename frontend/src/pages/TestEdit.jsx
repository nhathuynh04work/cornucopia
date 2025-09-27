import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { api } from "../apis/axios";

function TestEdit() {
	const { id } = useParams();
	const [test, setTest] = useState(null);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function getTestInfo(testId) {
			try {
				const res = await api.get(`/tests/${testId}`);
				console.log(res.data.test);
				setTest(res.data.test);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		}

		getTestInfo(id);
	}, [id]);

	if (loading) {
		return <p>Loading…</p>;
	}

	if (error) {
		return (
			<div>
				<p>{error}</p>
			</div>
		);
	}

	return (
		<div>
			<h1>{test.title}</h1>
			<p>{test.description}</p>
		</div>
	);
}

export default TestEdit;
