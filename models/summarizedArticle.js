import mongoose from "mongoose";

const summarizedArticleSchema = mongoose.Schema({
  summary: { type: String },
  url: { type: String },
});

export default mongoose.model(
  "SummarizedArticleModel",
  summarizedArticleSchema
);
