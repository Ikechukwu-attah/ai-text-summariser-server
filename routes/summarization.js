import express from "express";
import { summarized } from "../controllers/summarization.js";

const router = express.Router();

router.post("/summarize", summarized);

export default router;