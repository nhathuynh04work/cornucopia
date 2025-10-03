import { useParams } from "react-router";
import { useTestEditorQuery } from "../hooks/useTestEditorQuery";

function TestEdit() {
	const { id } = useParams();
	const { isLoading, isError } = useTestEditorQuery(id);

	if (isLoading) return <p>Loading...</p>;
	if (isError) return <p>Something went wrong</p>;

	return <div>{id}</div>;
}

export default TestEdit;
