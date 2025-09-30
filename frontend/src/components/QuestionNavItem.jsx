function QuestionNavItem({ children, id }) {
	return (
		<a
			href={`#question-${id}`}
			className={`border flex justify-center items-center text-sm aspect-square `}>
			{children}
		</a>
	);
}

export default QuestionNavItem;
