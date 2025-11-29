import { useState, useEffect, useMemo } from "react";
import { debounce } from "lodash";

export function useResourceFilters({
	defaultSort = "newest",
	defaultPage = 1,
	defaultLimit = 6,
	debounceTime = 500,
} = {}) {
	const [searchTerm, setSearchTerm] = useState("");
	const [debouncedSearch, setDebouncedSearch] = useState("");
	const [sort, setSort] = useState(defaultSort);
	const [page, setPage] = useState(defaultPage);
	const [limit, setLimit] = useState(defaultLimit);

	const [filters, setFilters] = useState({});

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
		setPage(1);
	}, [searchTerm, debouncedSetSearch]);

	const setFilter = (key, value) => {
		setFilters((prev) => ({ ...prev, [key]: value }));
		setPage(1);
	};

	const toggleFilterArray = (key, value) => {
		setFilters((prev) => {
			const current = prev[key] || [];
			const updated = current.includes(value)
				? current.filter((item) => item !== value)
				: [...current, value];
			return { ...prev, [key]: updated };
		});
		setPage(1);
	};

	const clearFilters = () => {
		setSearchTerm("");
		setFilters({});
		setPage(1);
	};

	return {
		searchTerm,
		setSearchTerm,
		debouncedSearch,
		sort,
		setSort,
		page,
		setPage,
		limit,
		setLimit,
		filters,
		setFilter,
		toggleFilterArray,
		clearFilters,
	};
}
