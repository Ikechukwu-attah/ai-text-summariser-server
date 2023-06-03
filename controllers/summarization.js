import { summarizeArticle } from "../utils/openAPIConfig.js";
import { extractArticleContent } from "./webScraping.js";
import SummarizedArticleModel from "../models/summarizedArticle.js";
import mongoose from "mongoose";

// export const handleSummarization = async (req, res, url) => {
//   try {
//     const text = req.body.text;
//     // console.log("text::", text);
//     const summary = await summarizeArticle(text);
//     console.log("Summary:::", summary);
//     res.json({ summary, url });
//     const result = new SummarizedArticleModel({ summary, url });
//     const saveResult = result.save();
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "Failed to summarize text" });
//   }
// };

export const handleSummarization = async (req, res, url) => {
  try {
    const text = req.body.text;
    const summary = await summarizeArticle(text);

    const result = new SummarizedArticleModel({ summary, url });
    await result.save();

    res.json({ summary, url });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to summarize text" });
  }
};

export const summarized = async (req, res) => {
  try {
    const url = req.body.url;
    // console.log("url::", url);
    const articleContent = await extractArticleContent(url);
    // console.log("articleContent:", articleContent);
    req.body.text = articleContent;
    await handleSummarization(req, res, url);
  } catch (error) {
    console.log("error from summary", error);
    res.status(500).json({ error: "Failed to summarize text" });
  }
};

export const getAllSummarizedArticle = async (req, res) => {
  try {
    const result = await SummarizedArticleModel.find();
    res.status(200).json(result);
  } catch (error) {
    console.log({ error });
    res.status(500).json({ error: error });
  }
};

export const getSingleSummarizedArticle = async (req, res) => {
  const { articleId } = req.params;
  console.log({ articleId });
  const article = await SummarizedArticleModel.findById(articleId);
  try {
    if (!article) {
      res.status(404).json({ message: "Article not found" });
    } else {
      res.status(200).json(article);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const deleteSummarizedArticle = async (req, res) => {
  const { articleId } = req.params;
  console.log({ articleId });

  if (!mongoose.Types.ObjectId.isValid(articleId)) {
    return res.status(404).json({ message: "Invalid article id" });
  }

  try {
    const deletedArticle = await SummarizedArticleModel.findByIdAndDelete(
      articleId
    );

    if (!deletedArticle) {
      return res.status(404).json({ message: "No article with this id found" });
    }

    return res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};
