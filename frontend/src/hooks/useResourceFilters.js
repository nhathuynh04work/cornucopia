import { useState, useEffect, useMemo } from "react";
import { debounce } from "lodash";

export function useResourceFilters({
	defaultSort = "newest",
	defaultScope = "ALL",
	debounceTime = 500,
} = {}) {
	const [searchTerm, setSearchTerm] = useState("");
	const [debouncedSearch, setDebouncedSearch] = useState("");
	const [sort, setSort] = useState(defaultSort);
	const [scope, setScope] = useState(defaultScope);

	const debouncedSetSearch = useMemo(
		() => debounce((value) => setDebouncedSearch(value), debounceTime),
		[debounceTime]
	);

	useEffect(() => {
		return () => {
			debouncedSetSearch.cancel();
		};
	}, [debouncedSetSearch]);

	useEffect(() => {
		debouncedSetSearch(searchTerm);
	}, [searchTerm, debouncedSetSearch]);

	return {
		searchTerm,
		setSearchTerm,
		debouncedSearch,
		sort,
		setSort,
		scope,
		setScope,
	};
}
