import axios from "axios";
import * as cheerio from "cheerio";

export const extractArticleContent = async () => {
  try {
    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);

    // Select the main content of the page
    // Replace 'article' with the appropriate CSS selector for the target website
    //   const articleContent = $("article").text();

    const commonSelectors = [
      "article",
      "main",
      "#content",
      ".content",
      ".main",
      ".post",
      ".post-content",
    ];

    let largestContent = "";
    let largestLength = 0;

    for (const selector of commonSelectors) {
      const content = $(selector).text().trim();
      if (content.length > largestLength) {
        largestContent = content;
        largestLength = content.length;
      }
    }

    if (!largestContent) {
      throw new Error("No suitable content found");
    }

    return largestContent;
  } catch (error) {
    console.error("Error while extracting article content ", error);
    throw error;
  }
};
