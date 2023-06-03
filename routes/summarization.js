import express from "express";
import {
  deleteSummarizedArticle,
  getAllSummarizedArticle,
  getSingleSummarizedArticle,
  summarized,
} from "../controllers/summarization.js";

const router = express.Router();

router.post("/", summarized);
router.get("/articles", getAllSummarizedArticle);
router.get("/article/:articleId", getSingleSummarizedArticle);
router.delete("/delete/:articleId", deleteSummarizedArticle);

export default router;
