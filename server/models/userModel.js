const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  // Authentication and identity fields
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 20,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    sparse: true,
    validate: {
      validator: function (v) {
        return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(v);
      },
      message: props => `${props.value} is not a valid email!`
    },
    trim: true,
  },
  phone: {
    type: String,
    unique: true,
    sparse: true,
    validate: {
      validator: function (v) {
        return /^(\+?\d{1,3}[- ]?)?\d{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false, // Exclude from queries by default
  },

  // Profile info
  name: String,
  age: Number,
  profilePicture: String,
  year: String,
  location: String,
  socials: String,
  skillsWanted: String,
  skillsOffered: String,

  // Ratings
  ratingSum: {
    type: Number,
    default: 0,
  },
  ratingCount: {
    type: Number,
    default: 0,
  },
});

// Hash and set password
UserSchema.methods.setPassword = async function (password) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(password, salt);
};

// Compare given password with hashed password
UserSchema.methods.validatePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Only compile model if it hasn't been compiled before
const User = mongoose.models.User || mongoose.model('User', UserSchema);

module.exports = User;
