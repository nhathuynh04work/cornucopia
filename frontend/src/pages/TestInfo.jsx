import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { fetchTestBasicInfo } from "../apis/testApi";

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
		<div>
			test info
			<p>{test.id}</p>
			<p>{test.title}</p>
		</div>
	);
}

export default TestInfo;
