import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
const userSchema = new Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  },
  password: {
    type: String,
    required: true,
    // minlength: 8,
    // match: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  },
  confirmPassword: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    default: "default.jpg",
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    default: "Male",
  },
});
// Conditional showing profile picture when user is not set a profile picture
// userSchema.pre("save", function (next) {
//   if (!this.profilePicture) {
//     this.profilePicture =
//       this.gender === "male" ? "male avatar.jpg" : "female avatar.jpg";
//   }
// });

// Encrypt the password and check password is correct
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
userSchema.methods.isPasswordCorrect = async function (password) {
  if (!password) return null;
  return await bcrypt.compare(password, this.password);
};
// Generate Access And Refresh Token
userSchema.methods.generateAccessAndRefreshToken = async function () {
  const token = await jwt.sign(
    { _id, email, fullName },
    process.env.ACCESS_TOKEN_SECRET_KEY,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
    }
  );
  return token;
};
userSchema.methods.generateRefreshToken = async function () {
  const token = await jwt.sign({ _id }, process.env.REFRESH_TOKEN_SECRET_KEY, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRE,
  });
  return token;
};
const User = mongoose.model("User", userSchema);
export default User;
