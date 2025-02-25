import { Router } from "express";
import {
  loginUser,
  LogOutUser,
  registerUser,
} from "../controllers/user.controller.js";
import upload from "../middleware/multer.middleware.js";
import verifyJwt from "../middleware/auth.middleware.js";

const router = Router();
router.route("/register").post(upload.single("profilePicture"), registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJwt, LogOutUser);
export default router;
