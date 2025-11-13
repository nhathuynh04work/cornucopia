const avatarSizes = {
	xs: "w-4 h-4",
	sm: "w-8 h-8",
	md: "w-16 h-16",
	lg: "w-32 h-32",
};

const baseClasses = "rounded-full object-cover border border-gray-300";

function Avatar({ size = "sm", url }) {
	const sizeClasses = avatarSizes[size] || avatarSizes.sm;

	return (
		<img
			src={url ?? "/default-avatar.svg"}
			alt="user avatar"
			className={`${sizeClasses} ${baseClasses}`}
		/>
	);
}

export default Avatar;
