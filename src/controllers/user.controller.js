import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password, confirmPassword, gender } = req.body;
  // Validation check if form empty or a whitespace
  if (!fullName || !email || !password || !confirmPassword || !gender) {
    throw new ApiError(400, "All fields are required");
  }
  if (
    [fullName, email, password, confirmPassword, gender].some(
      (field) => field.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields must have some value");
  }
  // Check Exist User
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "Email already exists");
  }
  // Load Profile Picture
  const profilePictureFilePath = req.file?.path;
  if (!profilePictureFilePath) {
    throw new ApiError(400, "Profile picture is required");
  }
  const profilePicture = await uploadOnCloudinary(profilePictureFilePath);
  const user = await User.create({
    fullName,
    email,
    password,
    confirmPassword,
    gender,
    profilePicture: profilePicture.url,
  });
  const createUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createUser) {
    throw new ApiError(500, "Failed to create user");
  }
  res
    .status(201)
    .json(
      new ApiResponse(200, user, { message: "User Registered Successfully" })
    );
});

export { registerUser };
