function ActionWrapper({ children, type, setHoveredMenu }) {
	return (
		<div
			className="relative"
			onMouseEnter={() => setHoveredMenu(type)}
			onMouseLeave={() => setHoveredMenu(null)}
			onClick={(e) => e.stopPropagation()}>
			{children}
		</div>
	);
}
export default ActionWrapper;
