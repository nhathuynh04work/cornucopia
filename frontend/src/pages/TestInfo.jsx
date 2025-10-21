import { useParams } from "react-router";
import NavButton from "../components/NavButton";
import { useTestLiteQuery } from "@/hooks/useTestQuery";

function TestInfo() {
	const { id } = useParams();
	const { data: test, isPending } = useTestLiteQuery(id);

	if (isPending) {
		return <p>Loading...</p>;
	}

	return (
		<div className="flex">
			<div className="w-5/6">
				test info
				<p>{test.id}</p>
				<p>{test.title}</p>
				<NavButton to={`/tests/${id}/edit`}>Edit</NavButton>
				<NavButton to={`/tests/${id}/attempt`}>Take test</NavButton>
			</div>
			<div className="w-1/6">Left side</div>
		</div>
	);
}

export default TestInfo;
