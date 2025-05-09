const express = require("express");
const connectDB = require("./config/db");
require("dotenv").config();
const authRouter = require("./routes/auth.routes");
const userRouter = require("./routes/user.routes");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send(`<h1>Blog API Service is running`);
});

app.use("/api/v1/auth", authRouter);
app.use('/api/v1/users', userRouter)

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`server started at http://localhost:${PORT}`);
  });
});
