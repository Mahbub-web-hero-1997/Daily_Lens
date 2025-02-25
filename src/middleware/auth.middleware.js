import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";

const verifyJwt = async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.headers("Authorization").replace("Bearer ", "");
    if (!token) {
      throw new Error("Unauthorized: No token provided.");
    }
    const decodedWithoutVerify = jwt.decode(token, { complete: true });
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
    const user = await User.findById(decoded?._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      throw new Error("Unauthorized: Invalid token.");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error.message);
  }
};

export default verifyJwt;
