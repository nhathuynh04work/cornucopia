import { useMemo } from "react";
import { useOutletContext } from "react-router";

export function useFilteredTests(useQueryHook) {
	const { searchTerm } = useOutletContext();
	const { data: tests, isPending } = useQueryHook();

	const filteredTests = useMemo(() => {
		if (!tests) return [];
		if (!searchTerm) return tests;

		return tests.filter((test) =>
			test.name.toLowerCase().includes(searchTerm.toLowerCase())
		);
	}, [tests, searchTerm]);

	return {
		filteredTests,
		isPending,
		searchTerm,
	};
}
