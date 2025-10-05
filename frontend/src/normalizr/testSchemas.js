import { schema } from "normalizr";

const answerOption = new schema.Entity("answerOptions");

// Cannot write like this because item has not been initialized => cannot use it inside the definition block
// const item = new schema.Entity("items", {
// 	answerOptions: [answerOption],
// 	children: [item],
// });

const item = new schema.Entity("items");
item.define({
	answerOptions: [answerOption],
	children: [item],
});

const testSection = new schema.Entity("testSections", {
	items: [item],
});

const test = new schema.Entity("tests", {
	testSections: [testSection],
});

export { test };
