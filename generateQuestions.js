import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateQuestions(topic, audience = "general") {

  const model = genAI.getGenerativeModel({
    model: "gemini-3.8-flash"
  });

  const prompt = `
You are an expert presentation coach.

Presentation topic: "${topic}"
Target audience: "${audience}"

Generate exactly 3 realistic questions this audience might ask.

Return ONLY JSON in this format:

{
  "questions": [
    "Question 1",
    "Question 2",
    "Question 3"
  ]
}
`;

  try {

    const result = await model.generateContent(prompt);

    const responseText = result.response.text();

    console.log("Gemini raw response:");
    console.log(responseText);

    const cleaned = responseText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const data = JSON.parse(cleaned);

    return data.questions;

  } catch (error) {

    console.error("===== GEMINI REAL ERROR =====");
    console.error(error);

    throw error;
  }
}