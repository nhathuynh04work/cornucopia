import { useParams } from "react-router";

function AttemptResult() {
	const { id } = useParams();

	return <div>{id}</div>;
}

export default AttemptResult;
