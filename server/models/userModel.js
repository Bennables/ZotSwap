const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  age: Number,
  profilePicture: String,
  year: String,
  location: String,
  talents: String,
  phone: String,
  email: { type: String, required: true, unique: true },
  socials: String,
  skillsWanted: String,
  skillsOffered: String,
<<<<<<< Updated upstream
});

module.exports = mongoose.model('User', UserSchema);
=======
  likesSent: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  likesReceived: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  matches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  ratingSum: {
    type: Number,
    default: 0,
  },
  ratingCount: {
    type: Number,
    default: 0,
  },

});

/**
 * Method to compare password with the hashed password in the database
 * @param {*} password - The password to compare
 */
UserSchema.methods.setPassword = async function (password) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(password, salt);
}

/**
 * Method to compare a given password with the stored hashed password
 * @param {*} password - The password to compare
 */
UserSchema.methods.validatePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
}

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);

>>>>>>> Stashed changes
