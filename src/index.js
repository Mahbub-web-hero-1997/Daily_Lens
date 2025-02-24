import dotenv from "dotenv";
import connectDB from "./db/connectionDB.js";
import app from "./app.js";
dotenv.config();
connectDB()
  .then(() => {
    const port = process.env.PORT || 8000;
    app.listen(port, () => {
      console.log(`Server running at port : ${port}`);
    });
  })
  .catch((err) =>
    console.log("Error connecting to the database: ", err.message)
  );
