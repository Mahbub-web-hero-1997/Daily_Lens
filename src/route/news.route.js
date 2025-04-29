import Router from "express";

import {
  createNews,
  deleteNews,
  getAllNews,
  getSingleNewsById,
  updateNews,
} from "../controllers/news.controllers.js";
import upload from "../middleware/multer.middleware.js";
import authorizedRoles from "../middleware/role.middleware.js";
import verifyJwt from "../middleware/auth.middleware.js";
const router = Router();

// Define routes here

router
  .route("/post")
  .post(
    upload.single("image"),
    verifyJwt,
    authorizedRoles("admin"),
    createNews
  );
router.route("/all").get(getAllNews);
router.route("/single-news/:id").get(getSingleNewsById);
router
  .route("/update-news/:id")
  .patch(
    upload.single("image"),
    verifyJwt,
    authorizedRoles("admin"),
    updateNews
  );
router
  .route("/delete/:id")
  .delete(verifyJwt, authorizedRoles("admin"), deleteNews);

export default router;
