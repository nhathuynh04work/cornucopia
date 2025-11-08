import { NavLink } from "react-router";

const baseClasses = "cursor-pointer";

function NavButton({ to, children, className, activeClassName, end = true }) {
	return (
		<NavLink
			to={to}
			end={end}
			className={({ isActive }) =>
				`${baseClasses} ${className} ${isActive ? activeClassName : ""}`
			}>
			{children}
		</NavLink>
	);
}

export default NavButton;
