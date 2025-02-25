import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";

const verifyJwt = async (req, res, next) => {
  try {
    let token = req.cookies?.accessToken || req.headers.authorization;

    // টোকেন না থাকলে Unauthorized error
    if (!token) {
      throw new ApiError(401, "Unauthorized: No token provided.");
    }

    // যদি হেডারে টোকেন থাকে, তবে "Bearer " অংশটি সরিয়ে ফেলতে হবে
    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    // টোকেন যাচাই
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);

    // ইউজার খোঁজা, তবে পাসওয়ার্ড আর রিফ্রেশ টোকেন ছাড়া
    const user = await User.findById(decoded?._id).select(
      "-password -refreshToken"
    );

    // যদি ইউজার না মেলে, তাহলে Unauthorized error
    if (!user) {
      throw new ApiError(401, "Unauthorized: Invalid token.");
    }

    // ইউজার অবজেক্ট রিকোয়েস্টে সংযুক্ত করা
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
