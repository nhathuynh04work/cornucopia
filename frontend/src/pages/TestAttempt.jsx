import { useTestAttemptQuery } from "@/hooks/useTestQuery";
import { useParams } from "react-router";

function TestAttempt() {
	const { id } = useParams();
	const { isPending } = useTestAttemptQuery(id);

	if (isPending) return <p> Loading...</p>;

	return <div>TestAttempt</div>;
}

export default TestAttempt;
