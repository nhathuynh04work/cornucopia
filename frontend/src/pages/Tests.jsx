import CreateTestCard from "@/components/Tests/CreateTestCard";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import {
	useTestsQuery,
	useAttemptedTests,
	useMyTests,
} from "@/hooks/useTestQuery";
import { useFilteredTests } from "@/hooks/useFilteredTests";
import TestList from "@/components/Tests/TestList";

export function AllTests() {
	const { filteredTests, isPending, searchTerm } =
		useFilteredTests(useTestsQuery);

	return (
		<TestList
			tests={filteredTests}
			isPending={isPending}
			searchTerm={searchTerm}
			emptyMessage="No tests found."
			searchEmptyMessage="No tests match your search."
		/>
	);
}

export function AttemptedTests() {
	const { filteredTests, isPending, searchTerm } =
		useFilteredTests(useAttemptedTests);

	return (
		<TestList
			tests={filteredTests}
			isPending={isPending}
			searchTerm={searchTerm}
			emptyMessage="You have not attempted any tests."
			searchEmptyMessage="No attempted tests match your search."
		/>
	);
}

export function MyTests() {
	const { role } = useAuth();

	const { filteredTests, isPending, searchTerm } =
		useFilteredTests(useMyTests);

	if (role !== "admin") return <Navigate to="/tests/all" replace />;

	return (
		<TestList
			tests={filteredTests}
			isPending={isPending}
			searchTerm={searchTerm}
			emptyMessage="You have not created any tests."
			searchEmptyMessage="No tests match your search."
			prependItem={<CreateTestCard />} 
		/>
	);
}
