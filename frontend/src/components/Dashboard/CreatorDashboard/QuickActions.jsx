export default function QuickActions() {
	return (
		<section>
			<h2 className="text-xl font-semibold text-gray-700 mb-5">
				Quick Actions
			</h2>
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				<button className="bg-purple-600 hover:bg-purple-700 text-white py-4 px-5 rounded-lg text-md">
					+ New Course
				</button>
				<button className="bg-purple-500 hover:bg-purple-600 text-white py-4 px-5 rounded-lg text-md">
					+ New Test
				</button>
				<button className="bg-purple-500 hover:bg-purple-600 text-white py-4 px-5 rounded-lg text-md">
					+ New Blog Post
				</button>
				<button className="bg-purple-500 hover:bg-purple-600 text-white py-4 px-5 rounded-lg text-md">
					+ New Flashcards
				</button>
			</div>
		</section>
	);
}
