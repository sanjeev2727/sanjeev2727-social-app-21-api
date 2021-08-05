const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require("mongoose");
const app = express();

//routes
const userRouter = require('./routes/users');
const authRouter = require('./routes/auth');

dotenv.config();

//middlewares
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

//DB COnnection
mongoose.connect(process.env.DB_CONN_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);

app.listen(process.env.PORT, () => {
    console.log("Server is running at :", process.env.PORT);
});