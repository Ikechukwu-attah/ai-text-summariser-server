import { Configuration, OpenAIApi } from "openai";
import * as dotenv from "dotenv";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// export const summarizeArticle = async (articleContent) => {
//   //   console.log("articleContent:", articleContent);
//   const prompt = `Summarize the following article:\n\n${articleContent}\n\nSummary:`;
//   console.log("prompt:", prompt);
//   console.log("API Key:", process.env.OPENAI_API_KEY);
//   try {
//     const response = await openai.createCompletion({
//       model: "text-davinci-002",
//       prompt,
//       max_tokens: 60, // Adjust the number of tokens based on your desired summary length
//       n: 1,
//       stop: null,
//       temperature: 0.5,
//     });

//     // console.log("response:", response);
//     console.log("Response data:", response.data);
//     return response.choices[0].text.trim();
//   } catch (error) {
//     console.log("Error during summarization:", error);
//     throw error;
//   }
// };

export const summarizeArticle = async (articleContent) => {
  const prompt = `Summarize the following article:\n\n${articleContent}\n\nSummary:`;
  //   console.log("prompt:", prompt);
  //   console.log("API Key:", process.env.OPENAI_API_KEY);
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-002",
      prompt,
      max_tokens: 60, // Adjust the number of tokens based on your desired summary length
      n: 1,
      stop: null,
      temperature: 0.5,
    });

    console.log("Response data:", response.data.choices[0]);
    if (response && response.data.choices && response.data.choices[0]) {
      return response.data.choices[0].text.trim();
    } else {
      console.error("No choices in response.");
      throw new Error("No choices in response.");
    }
  } catch (error) {
    console.log("Error during summarization:", error);
    throw error;
  }
};
