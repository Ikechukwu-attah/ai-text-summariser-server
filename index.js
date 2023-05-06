import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import connectDB from "./mongodb/connect.js";
import userRouter from "./routes/user.js";
import summarizedRouter from "./routes/summarization.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limits: "50mb" }));

app.use("/summarize", summarizedRouter);
app.use("/users", userRouter);

app.get("/", (req, res) => {
  res.send({ message: "Hello World" });
});

const startServer = async () => {
  try {
    connectDB(process.env.MONGODB_URL);
    app.listen(8080, () =>
      console.log("Server running on port http://localhost:8080 ")
    );
  } catch (error) {
    console.log(error);
  }
};

startServer();
