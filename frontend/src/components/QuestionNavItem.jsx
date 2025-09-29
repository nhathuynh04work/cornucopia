import { useLocation } from "react-router";

function QuestionNavItem({ children, id }) {
	const { hash } = useLocation();
	const targetHash = `#question-${id}`;
	const isActive = hash === targetHash;

	return (
		<a
			href={targetHash}
			className={`border flex justify-center items-center text-sm aspect-square ${
				isActive ? "bg-blue-500 text-white" : ""
			}`}>
			{children}
		</a>
	);
}

export default QuestionNavItem;
