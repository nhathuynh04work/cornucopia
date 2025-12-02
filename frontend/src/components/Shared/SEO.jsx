export default function SEO({
	title,
	description = "Unlock your potential with Cornucopia",
}) {
	return (
		<>
			<title>{title ? `${title}` : "Cornucopia"}</title>
			<meta name="description" content={description} />

			{/* Open Graph / Social Media tags */}
			<meta
				property="og:title"
				content={title ? `${title}` : "Cornucopia"}
			/>
			<meta property="og:description" content={description} />
		</>
	);
}
