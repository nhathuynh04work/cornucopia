import prisma from "../prisma.js";

export async function submitAnswer(data, client = prisma) {
  return await client.sessionAnswer.create({ data });
}
