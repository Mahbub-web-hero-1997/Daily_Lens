import Router from "express";

import {
  createNews,
  deleteNews,
  getAllNews,
  getSingleNewsById,
  updateNews,
} from "../controllers/news.controllers.js";
import upload from "../middleware/multer.middleware.js";

const router = Router();

// Define routes here

router.route("/post").post(upload.single("image"), createNews);
router.route("/all").get(getAllNews);
router.route("/single-news/:id").get(getSingleNewsById);
router.route("/update-news/:id").patch(upload.single("image"), updateNews);
router.route("/delete/:id").delete(deleteNews);

export default router;
