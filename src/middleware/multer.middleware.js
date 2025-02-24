import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/temp"); // Ensure this directory exists
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Save with original filename
  },
});

const upload = multer({ storage });

export default upload;
