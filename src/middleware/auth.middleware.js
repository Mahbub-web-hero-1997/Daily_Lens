import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const verifyJwt = asyncHandler(async (req, _, next) => {
  const token =
    req.cookies.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    throw new ApiError(401, "Unauthorized access, token not found");
  }
  const verifyToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
  const user = await User.findById(verifyToken._id);
  if (!user) {
    throw new ApiError(401, "Unauthorized access, user not found");
  }
  req.user = user;
  next();
});
export default verifyJwt;
