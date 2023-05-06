import { Configuration, OpenAIApi } from "openai";
import * as dotenv from "dotenv";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export const summarizeArticle = async (url) => {
  const prompt = `Summarize the following article:\n\n${url}\n\nSummary:`;
  const response = await openai.createCompletion({
    model: "text-davinci-002",
    prompt,
    max_tokens: 60, // Adjust the number of tokens based on your desired summary length
    n: 1,
    stop: null,
    temperature: 0.5,
  });

  return response.choices[0].text.trim();
};
