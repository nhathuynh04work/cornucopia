import { createContext, useContext } from "react";

const CourseEditorContext = createContext(null);

export function CourseEditorProvider({ children, value }) {
	return (
		<CourseEditorContext.Provider value={value}>
			{children}
		</CourseEditorContext.Provider>
	);
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCourseEditor() {
	const context = useContext(CourseEditorContext);
	if (!context) {
		throw new Error(
			"useCourseEditor must be used within a CourseEditorProvider"
		);
	}
	return context;
}
