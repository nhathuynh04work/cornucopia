import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { fetchTestBasicInfo } from "../apis/testApi";
import NavButton from "../components/NavButton";

function TestInfo() {
	const { id } = useParams();
	const { data: test, isLoading } = useQuery({
		queryKey: ["tests", id, "lite"],
		queryFn: () => fetchTestBasicInfo(id),
	});

	if (isLoading) {
		return <p>Loading...</p>;
	}

	return (
		<div className="flex">
			<div className="w-5/6">
				test info
				<p>{test.id}</p>
				<p>{test.title}</p>
				<NavButton to={`/tests/${id}/edit`}>Edit</NavButton>
			</div>
			<div className="w-1/6">Left side</div>
		</div>
	);
}

export default TestInfo;
