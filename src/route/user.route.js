import { Router } from "express";
import {
  changePassword,
  getCurrentUser,
  loginUser,
  LogOutUser,
  registerUser,
  updateProfilePicture,
} from "../controllers/user.controller.js";
import upload from "../middleware/multer.middleware.js";
import verifyJwt from "../middleware/auth.middleware.js";
import authorizedRoles from "../middleware/role.middleware.js";

const router = Router();
router.route("/register").post(upload.single("profilePicture"), registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJwt, LogOutUser);
router.route("/changePassword").post(verifyJwt, changePassword);
router
  .route("/changeProfilePicture")
  .patch(upload.single("profilePicture"), verifyJwt, updateProfilePicture);
router
  .route("/currentUser")
  .get(verifyJwt, authorizedRoles("user"), getCurrentUser);
router.route("/admin").get(verifyJwt, authorizedRoles("admin"), getCurrentUser);
export default router;
