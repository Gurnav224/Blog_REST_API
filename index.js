const express = require("express");
const connectDB = require("./config/db");
require("dotenv").config();
const userRouter = require('./routes/user.routes');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send(`<h1>Blog API Service is running`);
});



app.use('/api/v1/auth',userRouter)


const PORT = process.env.PORT || 3000;



connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`server started at http://localhost:${PORT}`);
  });
});
