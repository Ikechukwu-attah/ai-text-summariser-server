import express from "express";
import {
  getAllSummarizedArticle,
  getSingleSummarizedArticle,
  summarized,
} from "../controllers/summarization.js";

const router = express.Router();

router.post("/", summarized);
router.get("/articles", getAllSummarizedArticle);
router.get("/article/:articleId", getSingleSummarizedArticle);

export default router;
