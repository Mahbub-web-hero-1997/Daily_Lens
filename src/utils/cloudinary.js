import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
  api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET,
  //   secure: true,
  //   url: "https://res.cloudinary.com/your_cloud_name/image/upload",
  //   transformation: [{ width: 800, height: 600, crop: "fill" }], // Resize and crop the image
});

const uploadOnCloudinary = async (localFilePath) => {
  console.log(localFilePath);
  try {
    if (!localFilePath) return null;
    const result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    fs.unlinkSync(localFilePath);
    return result;
  } catch (error) {
    console.error(`Error uploading to Cloudinary: ${error.message}`);
    fs.unlinkSync(localFilePath);
  }
};

export default uploadOnCloudinary;
