import { useParams } from "react-router";

function TestEdit() {
	const { id } = useParams();
    
	return <div>{id}</div>;
}

export default TestEdit;
