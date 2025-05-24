const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  age: Number,
  year: String,
  location: String,
  talents: String,
  phone: String,
  email: String,
  socials: String,
  skillsWanted: String,
  skillsOffered: String,
});

module.exports = mongoose.model('User', UserSchema);
