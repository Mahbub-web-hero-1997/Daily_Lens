import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

// Generate Access And Refresh Token

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Failed to generate tokens", error);
  }
};

// User Register Api
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
  res.status(201).json(
    new ApiResponse(200, createUser, {
      message: "User Registered Successfully",
    })
  );
});
// User Login Api
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "Email and Password are required");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid password");
  }
  // Generate Access Token
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },

        "User Logged In Successfully"
      )
    );
});
// Log Out User
const LogOutUser = asyncHandler(async (req, res) => {
  if (!req.user || !req.user._id) {
    throw new ApiError(401, "Unauthorized - user not found");
  }
  await User.findByIdAndUpdate(
    req.user._id,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
      new ApiResponse(200, null, { message: "User Logged Out Successfully" })
    );
});
// Change Password
const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid old password");
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(
      new ApiResponse(200, null, { message: "Password Changed Successfully" })
    );
});
// Update Profile Picture
const updateProfilePicture = asyncHandler(async (req, res) => {
  const profilePictureFilePath = req.file?.path;

  if (!profilePictureFilePath) {
    throw new ApiError(400, "Profile picture is required");
  }
  const profilePicture = await uploadOnCloudinary(profilePictureFilePath);
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      profilePicture: profilePicture.url,
    },
    { new: true }
  );
  if (!user) {
    throw new ApiError(500, "Failed to update profile picture");
  }
  return res.status(200).json(
    new ApiResponse(200, user, {
      message: "Profile Picture Updated Successfully",
    })
  );
});
// Get Current User
const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current User Fetched Successfully"));
});
export {
  registerUser,
  loginUser,
  LogOutUser,
  changePassword,
  updateProfilePicture,
  getCurrentUser,
};
