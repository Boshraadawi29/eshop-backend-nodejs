require("dotenv/config");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const api = process.env.API_URL;
const cors = require('cors');

app.use(cors()); //apply CORS rules (allow other domains to make requests to my server)
// app.options('/*', cors()); //this cause an error 

const productRouter = require("./routers/products");
// const categoryRouter = require("./routers/categories");

//middleware
app.use(bodyParser.json());
app.use(morgan("tiny")); //morgan library is http requests logger

//Routers
app.use(`${api}/products`, productRouter);
// app.use(`${api}/categories`, categoryRouter)

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    //then on succsess
    console.log("Database is connected! ");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(3000, () => {
  console.log("SERVER IS RUNNING NOW!");
  console.log(api);
});
