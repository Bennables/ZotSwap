const dotenv = require('dotenv');
dotenv.config();  // load env variables ASAP

const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');

const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');

const app = express();
const PORT = 4000;

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/users', usersRouter);
app.use('/auth', authRouter);

const upload = multer({ dest: 'uploads/' });

const People = require('./modelx/userModel');

app.post('/api/signup', upload.fields([{ name: 'video' }, { name: 'image' }]), async (req, res) => {
  try {
    const {
      firstName, lastName, age, year, location, phone, email,
      instagram, snapchat, tiktok, discord, twitter, countryCode,
    } = req.body;

    const skillsOffered = [];
    const skillsWanted = [];

    for (const key in req.body) {
      if (key.startsWith('skillsOffered')) skillsOffered.push(req.body[key]);
      if (key.startsWith('skillsWanted')) skillsWanted.push(req.body[key]);
    }

    const newUser = new People({
      firstName,
      lastName,
      age,
      year,
      location,
      phone: `${countryCode} ${phone}`,
      email,
      instagram,
      snapchat,
      tiktok,
      discord,
      twitter,
      skillsOffered,
      skillsWanted,
      videoPath: req.files?.video?.[0]?.path || null,
      imagePath: req.files?.image?.[0]?.path || null,
    });

    await newUser.save();
    res.status(201).json({ message: 'User saved!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save user' });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

mongoose.connect(process.env.DB_URL)
  .then(() => {
    console.log('Connected to MongoDB database');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });



module.exports = app;

