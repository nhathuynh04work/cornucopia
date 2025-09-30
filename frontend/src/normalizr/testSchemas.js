import { schema } from "normalizr";

const answerOption = new schema.Entity("answerOptions");

const question = new schema.Entity("questions", {
	answerOptions: [answerOption],
});

const questionGroup = new schema.Entity("questionGroups", {
	questions: [question],
});

const testSection = new schema.Entity("testSections", {
	questionGroups: [questionGroup],
});

const test = new schema.Entity("tests", {
	testSections: [testSection],
});

export { test };
