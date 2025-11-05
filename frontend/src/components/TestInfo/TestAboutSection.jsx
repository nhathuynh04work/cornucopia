// src/components/TestInfo/TestAboutSection.jsx

function TestAboutSection({ test }) {
	return (
		<div className="border-b border-gray-200">
			{" "}
			{/* Added border */}
			<div className="p-6">
				{" "}
				{/* Added padding here */}
				<h2 className="text-lg font-semibold text-gray-900 mb-4">
					About this Test
				</h2>
				<div className="space-y-4">
					<div>
						<p className="text-xs font-medium text-gray-500 uppercase">
							Test ID
						</p>
						<p className="text-sm text-gray-700">{test.id}</p>
					</div>
					<div>
						<p className="text-xs font-medium text-gray-500 uppercase">
							Created
						</p>
						<p className="text-sm text-gray-700">
							{new Date(test.createdAt).toLocaleDateString(
								"en-US",
								{
									year: "numeric",
									month: "long",
									day: "numeric",
								}
							)}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default TestAboutSection;
