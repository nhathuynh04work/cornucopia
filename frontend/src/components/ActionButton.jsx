const baseClasses = "cursor-pointer";

function Button({ onClick, children, className }) {
	return (
		<button onClick={onClick} className={`${baseClasses} ${className}`}>
			{children}
		</button>
	);
}

export default Button;
