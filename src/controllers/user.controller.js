import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

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
});

export { registerUser };
