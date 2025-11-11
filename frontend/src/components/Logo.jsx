import { Link } from "react-router";

function Logo({ isLink = true }) {
	const tailwindClasses = "text-lg font-bold text-gray-800 font-anton";

	if (!isLink) {
		return <span className={tailwindClasses}>Cornucopia</span>;
	}

	return (
		<Link to="/dashboard" className={tailwindClasses}>
			Cornucopia
		</Link>
	);
}

export default Logo;
