const avatarSizes = {
	small: "w-8 h-8",
	medium: "w-16 h-16",
	large: "w-32 h-32",
};

const baseClasses = "rounded-full object-cover border border-gray-300";

function Avatar({ size = "small", url }) {
	const sizeClasses = avatarSizes[size] || avatarSizes.small;

	return (
		<img
			src={url ?? "/default-avatar.svg"}
			alt="user avatar"
			className={`${sizeClasses} ${baseClasses}`}
		/>
	);
}

export default Avatar;
