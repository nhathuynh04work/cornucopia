let aiClient = null;

export async function getAiClient() {
	if (aiClient) return aiClient;

	if (!process.env.GEMINI_API_KEY) return null;

	try {
		const { GoogleGenerativeAI } = await import("@google/generative-ai");
		aiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
		return aiClient;
	} catch (e) {
		console.error("Gemini init failed:", e);
		return null;
	}
}
