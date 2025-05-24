const dotenv = require('dotenv');
dotenv.config();  // load env variables ASAP

const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

const usersRouter = require('./routes/users');

const app = express();

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/users', usersRouter);

mongoose.connect(process.env.DB_URL)
  .then(() => {
    console.log('Connected to MongoDB database');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });

module.exports = app;

