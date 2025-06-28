require('dotenv/config');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const authJWT = require('./helpers/jwt');

const productRouter = require('./routers/products');
const categoryRouter = require('./routers/categories');
const userRouter = require('./routers/users');
// const ordersRoutes = require('./routes/orders');

// Validate environment variables
if (!process.env.MONGO_URL || !process.env.API_URL || !process.env.PORT) {
  console.error(
    '❌ Missing required environment variables (MONGO_URL, API_URL, PORT)',
  );
  process.exit(1);
}

// Config
const app = express();
const api = process.env.API_URL;
const port = process.env.PORT || 3000;

//middleware
app.use(cors());
app.use(express.json());
app.use(morgan('tiny')); // Log HTTP requests
app.use(authJWT())

//Routers
app.use(`${api}/products`, productRouter);
app.use(`${api}/categories`, categoryRouter);
app.use(`${api}/users`, userRouter);
// app.use(`${api}/orders`, ordersRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('🔥 Unexpected Error:', err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong!' });
});

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ Database connected successfully');

    app.listen(port, () => {
      console.log(`🚀 Server is running on http://localhost:${port}`);
      console.log(`🌐 API base URL: ${api}`);
    });
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB', err);
    process.exit(1);
  }
};

startServer();
