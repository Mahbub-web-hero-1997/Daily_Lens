import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";

const verifyJwt = async (req, res, next) => {
  try {
    let token = req.cookies?.accessToken || req.headers.authorization;

    if (!token) {
      throw new ApiError(401, "Unauthorized: No token provided.");
    }

    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);

    const user = await User.findById(decoded?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Unauthorized: Invalid token.");
    }
    19971;
    req.user = user;

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      throw new ApiError(401, "Unauthorized: Invalid token.");
    }
    if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "Unauthorized: Token expired.");
    }
    throw new ApiError(401, error.message || "Unauthorized");
  }
};

export default verifyJwt;
