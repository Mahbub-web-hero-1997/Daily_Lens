import News from "../models/news.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
// Create A news
const createNews = asyncHandler(async (req, res) => {
  // Get the news Data from the body
  const { title, description, category } = req.body;
  if ([title, description, category].some((field) => field.trim() == "")) {
    throw new ApiError(400, "All fields are required");
  }
  //   Check news are already created
  const existingNews = await News.findOne({
    $or: [{ title }, { description }],
  });
  if (existingNews) {
    throw new ApiError(400, "News already exists");
  }
  //   Upload News Image to cloudinary
  const imageLocalPath = await req.file?.path;
  //   console.log(await req.file?.path);
  if (!imageLocalPath) {
    throw new ApiError(400, "Image is required");
  }
  const image = await uploadOnCloudinary(imageLocalPath);
  if (!image) {
    throw new ApiError(500, "Failed to upload image to cloudinary");
  }
  const news = await News.create({
    title,
    description,
    category,
    image: image.url,
  });
  res
    .status(201)
    .json(
      new ApiResponse(200, news, "A new news has been created successfully")
    );
});
// Get All news
const getAllNews = asyncHandler(async (req, res) => {
  // let { page, limit } = req.query;
  // page = parseInt(page) || 1;
  // limit = parseInt(6);

  // const totalNews = await News.countDocuments();
  const news = await News.find();
  //   .skip((page - 1) * limit)
  //   .limit(limit)
  //   .sort({ createdAt: -1 });
  if (!news && !news.length) return "No news available";
  res.status(200).json(
    new ApiResponse(
      200,
      {
        // totalNews,
        // currentPage: page,
        // totalPages: Math.ceil(totalNews / limit),
        news,
      },
      "All news have been fetched successfully"
    )
  );
});
// Get single news By Id
const getSingleNewsById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const news = await News.findById(id);

  if (!news) {
    throw new ApiError(404, "News not found");
  }

  res.status(200).json(new ApiResponse(200, news, "News fetched successfully"));
});
// update a news
const updateNews = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  // update
  const news = await News.findByIdAndUpdate(
    id,
    { title, description },
    {
      new: true,
      runValidations: true,
    }
  );
  if (!news) {
    throw new ApiError(404, "News not found");
  }
  res.status(200).json(new ApiResponse(200, news, "News updated successfully"));
});
// Delete a news
const deleteNews = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const news = await News.findByIdAndDelete(id);
  if (!news) {
    throw new ApiError(404, "News not found");
  }
  res.status(200).json(new ApiResponse(null, 200, "News deleted successfully"));
});
export { createNews, getAllNews, getSingleNewsById, updateNews, deleteNews };
