import { summarizeArticle } from "../utils/openAPIConfig.js";
import { extractArticleContent } from "./webScraping.js";

export const handleSummarization = async (req, res) => {
  try {
    const text = req.body.text;
    const summary = await summarizeArticle(text);
    res.json({ summary });
  } catch (error) {
    res.status(500).json({ error: "Failed to summarize text" });
  }
};

export const summarized = async (req, res) => {
  try {
    const url = req.body.url;
    const articleContent = await extractArticleContent(url);
    req.body.text = articleContent;
    handleSummarization(req, res);
  } catch (error) {
    res.status(500).json({ error: "Failed to summarize text" });
  }
};
