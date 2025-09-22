import { Link } from "react-router";

const baseClasses = "cursor-pointer";

function NavButton({ to, children, className }) {
	return (
		<Link to={to} className={`${baseClasses} ${className}`}>
			{children}
		</Link>
	);
}

export default NavButton;
