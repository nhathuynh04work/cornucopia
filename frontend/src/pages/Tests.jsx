import { useState } from "react";
import Modal from "../components/Modal";
import CreateTestForm from "../components/CreateTestForm";
import { useNavigate } from "react-router";
import NavButton from "../components/NavButton.jsx";
import { useCreateTestMutation } from "../hooks/useTestMutation.js";
import { toast } from "react-hot-toast";
import { useTestsQuery } from "@/hooks/useTestQuery";
import { Plus, Clock, HelpCircle, Search } from "lucide-react";
import { formatTime } from "@/lib/text";

// --------------------------------------------------------------------------
// Sub-Component: TabButton (Now used for all tabs)
// --------------------------------------------------------------------------
function TabButton({ children, isActive, onClick }) {
	return (
		<button
			onClick={onClick}
			className={`px-3 py-2 text-sm font-medium transition-colors ${
				isActive
					? "border-b-2 border-purple-600 text-purple-600"
					: "border-b-2 border-transparent text-gray-500 hover:text-gray-700"
			}`}>
			{children}
		</button>
	);
}

// --------------------------------------------------------------------------
// Sub-Component: TestCard (No changes)
// --------------------------------------------------------------------------
function TestCard({ test }) {
	const questionsCount = test._count?.items || 0;
	const timeLimit = test.timeLimit;

	return (
		<NavButton
			to={`/tests/${test.id}`}
			key={test.id}
			className="block p-5 bg-white border border-gray-200 rounded-lg shadow-sm transition-all hover:shadow-md hover:border-purple-400 h-36 flex flex-col justify-between">
			<div>
				<p className="font-semibold text-lg text-gray-900 truncate">
					{test.title}
				</p>
			</div>
			<div className="space-y-2 mt-2">
				<div className="flex items-center gap-2 text-sm text-gray-600">
					<HelpCircle className="w-4 h-4 text-gray-400" />
					<span>
						{questionsCount}{" "}
						{questionsCount === 1 ? "Question" : "Questions"}
					</span>
				</div>
				<div className="flex items-center gap-2 text-sm text-gray-600">
					<Clock className="w-4 h-4 text-gray-400" />
					<span>
						{timeLimit ? formatTime(timeLimit) : "No limit"}
					</span>
				</div>
			</div>
		</NavButton>
	);
}

// --------------------------------------------------------------------------
// Sub-Component: EmptyState (Logic simplified)
// --------------------------------------------------------------------------
function EmptyState({ activeTab, searchTerm, onNewTestClick }) {
	let message = "No tests found.";
	if (searchTerm) {
		message = "No tests match your search.";
	} else if (activeTab === "drafts") {
		message = "You have no draft tests.";
	} else if (activeTab === "ielts") {
		message = "No IELTS tests found.";
	} else if (activeTab === "toeic") {
		message = "No TOEIC tests found.";
	} else {
		message = "No published tests found.";
	}

	const showCreateButton = !searchTerm && activeTab === "drafts";

	return (
		<div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-300 rounded-lg bg-white h-full">
			<p className="text-lg font-medium text-gray-700 mb-4">{message}</p>
			{showCreateButton && (
				<button
					onClick={onNewTestClick}
					className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-700 rounded-md hover:bg-purple-800">
					<Plus className="w-4 h-4" />
					Create your first test
				</button>
			)}
		</div>
	);
}

// --------------------------------------------------------------------------
// Main Component: Tests
// --------------------------------------------------------------------------
function Tests() {
	// --- State ---
	const [activeTab, setActiveTab] = useState("all"); // Default tab is now "all"
	const [searchTerm, setSearchTerm] = useState("");
	const [showModal, setShowModal] = useState(false);
	const navigate = useNavigate();

	// --- Role (Mocked) ---
	const userRole = "admin"; // Change to "user" to see the normal view

	// --- Data Fetching ---
	// Fetches when tab is "all", "ielts", or "toeic"
	const { data: publishedTests, isPending: isPublishedPending } =
		useTestsQuery({
			enabled: activeTab !== "drafts",
			category: activeTab, // Pass "all", "ielts", or "toeic" to the hook
		});

	// Fetches only when tab is "drafts"

	const draftTests = [];
	const isDraftPending = false;

	const createTest = useCreateTestMutation();

	// --- Handlers ---
	async function handleCreateTest({ title, description }) {
		const newTest = await createTest.mutateAsync({ title, description });
		toast.success("Test created successfully");
		navigate(`/tests/${newTest.id}/edit`);
	}

	// --- Derived State ---
	const isPending =
		(activeTab !== "drafts" && isPublishedPending) ||
		(activeTab === "drafts" && isDraftPending);
	const tests = (activeTab === "drafts" ? draftTests : publishedTests) || [];
	const filteredTests = tests.filter((test) =>
		test.title.toLowerCase().includes(searchTerm.toLowerCase())
	);

	// Dynamic placeholder for search bar
	const placeholders = {
		all: "Search all published tests...",
		ielts: "Search IELTS tests...",
		toeic: "Search TOEIC tests...",
		drafts: "Search your drafts...",
	};

	if (isPending) {
		return <p className="p-6">Loading...</p>;
	}

	return (
		<>
			<div className="flex flex-col h-[calc(100vh-65px)] overflow-hidden bg-white">
				{/* Header bar: Search and New Test Button */}
				<div className="flex justify-between items-center px-6 pt-6 pb-4 bg-white">
					<div className="relative w-full max-w-sm">
						<span className="absolute inset-y-0 left-0 flex items-center pl-3">
							<Search className="w-5 h-5 text-gray-400" />
						</span>
						<input
							type="text"
							placeholder={placeholders[activeTab]}
							className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>

					{userRole === "admin" && (
						<button
							onClick={() => setShowModal(true)}
							className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-700 rounded-md hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
							<Plus className="w-4 h-4" />
							New Test
						</button>
					)}
				</div>

				{/* Simplified Tab Bar */}
				<div className="px-6 border-b border-gray-200">
					<nav className="-mb-px flex gap-4">
						<TabButton
							isActive={activeTab === "all"}
							onClick={() => setActiveTab("all")}>
							All
						</TabButton>
						<TabButton
							isActive={activeTab === "ielts"}
							onClick={() => setActiveTab("ielts")}>
							IELTS
						</TabButton>
						<TabButton
							isActive={activeTab === "toeic"}
							onClick={() => setActiveTab("toeic")}>
							TOEIC
						</TabButton>
						{userRole === "admin" && (
							<TabButton
								isActive={activeTab === "drafts"}
								onClick={() => setActiveTab("drafts")}>
								Drafts
							</TabButton>
						)}
					</nav>
				</div>

				{/* Scrollable grid area */}
				<div className="flex-1 overflow-y-auto scroll-container p-6">
					{filteredTests.length === 0 ? (
						<EmptyState
							activeTab={activeTab}
							searchTerm={searchTerm}
							onNewTestClick={() => setShowModal(true)}
						/>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
							{filteredTests.map((test) => (
								<TestCard test={test} key={test.id} />
							))}
						</div>
					)}
				</div>
			</div>

			{/* Modal */}
			{showModal && (
				<Modal onClose={() => setShowModal(false)}>
					<h2 className="text-xl font-semibold text-gray-800 mb-4">
						Create New Test
					</h2>
					<CreateTestForm
						onSubmit={handleCreateTest}
						onCancel={() => setShowModal(false)}
					/>
				</Modal>
			)}
		</>
	);
}

export default Tests;
