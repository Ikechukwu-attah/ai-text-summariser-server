import express from "express";
import {
  forgotPassword,
  logIn,
  resetPassword,
  signUp,
  enable2FA,
  verify2FA,
  singleUser,
  getAllUser,
} from "../controllers/user.js";

const router = express.Router();

router.post("/signin", logIn);
router.post("/signup", signUp);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/single-user/:userId", singleUser);
router.get("/allUser", getAllUser);
router.post("/enable2fa/:userId", enable2FA);
router.post("/verify2fa", verify2FA);

export default router;
