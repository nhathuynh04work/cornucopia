import { schema } from "normalizr";

const answerOption = new schema.Entity("answerOptions");

const question = new schema.Entity("questions", {
	options: [answerOption],
});

const questionGroup = new schema.Entity("questionGroups", {
	questions: [question],
});

const section = new schema.Entity("sections", {
	groups: [questionGroup],
});

const test = new schema.Entity("tests", {
	sections: [section],
});

export { test };
