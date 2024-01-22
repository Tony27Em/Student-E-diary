require('dotenv').config();

const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const app = express();
const router = require('./router');
const path = require('path');
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL,
}));

app.use('/api', router);
app.use('/shopImages', express.static(path.join(__dirname, 'public/shop')));
app.use('/rewardsImages', express.static(path.join(__dirname, 'public/rewards')));
app.use('/libraryImages', express.static(path.join(__dirname, 'public/library/books/images')));
app.use('/avatars', express.static(path.join(__dirname, 'public/avatars')));

const start = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log('Database connected');    

    app.listen(PORT, () => {
      console.log('Server is running on port 5000');
    });

  } catch(e) {
    console.log('Something went wrong!', e);
  }
}

start();