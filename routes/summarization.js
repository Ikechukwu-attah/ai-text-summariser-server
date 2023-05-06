import express from "express";
import { summarized } from "../controllers/summarization.js";

const router = express.Router();

router.post("/", summarized);

export default router;
