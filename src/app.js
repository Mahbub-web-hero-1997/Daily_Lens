import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(
  express.json({
    extended: true,
    limit: "16kb",
  })
);
app.use(cors());
app.use(express.static("./public/temp"));
app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);
app.use(
  cookieParser({
    secure: false, // Set to true for production
    httpOnly: true, // Set to true to make the cookie inaccessible via JavaScript
  })
);
// Import All routes
import newsRoute from "./route/news.route.js";
import userRoute from "./route/user.route.js";
app.use("/api/v1/news", newsRoute);
app.use("/api/v1/user", userRoute);
// http://localhost:3000/api/v1/news/post

export default app;
