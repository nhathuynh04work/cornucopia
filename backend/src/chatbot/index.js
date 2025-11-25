import { defaults } from "../utils/constants.js";
import { rerank } from "./rerank.js";
import { retrieve } from "./retrieve.js";
import { summarize } from "./summarize.js";


export default async function getChatbotAnswer(req, res) {
	const question = req.body.question;

    // Get hits based on user question
    // Hits: fragments of item that has similar feature to the question
	const hits = await retrieve(question);

	if (!hits.length) return defaults.CHATBOT_ANSWER;

    // Rerank the hits
    // Make sure they reach a certain threshold to be considered answer-worthy
	const ranked = rerank(hits, question);

    // Send context to AI and get a "humanized" answer with citations of related content
	const answer = await summarize(ranked, question);

	res.status(200).json(answer);
}
