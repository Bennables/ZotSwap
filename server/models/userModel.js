const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect(process.env.DB_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const UserSchema = new mongoose.Schema({
  // Authentication and identity fields
  email: {
    type: String,
    required: true,
    unique: true,
    sparse: true,
    validate: {
      validator: function(v) {
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
      validator: function(v) {
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
  firstName: String,
  lastName: String,
  name: {
    type: String,
    set: function() {
      return `${this.firstName} ${this.lastName}`.trim();
    }
  },
  age: Number,
  profilePicture: String,
  year: String,
  location: String,

  // Social media and skills
  socials: {
    instagram: String,
    snapchat: String,
    tiktok: String,
    discord: String,
    twitter: String
  },
  skillsWanted: [String],
  skillsOffered: [String],
  talents: String,

  // Matching system
  likesSent: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  likesReceived: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  matches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  // Ratings
  ratingSum: {
    type: Number,
    default: 0,
  },
  ratingCount: {
    type: Number,
    default: 0,
  }
});

// Hash and set password - fix method name
UserSchema.methods.setPassword = async function(password) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(password, salt);
};

// Validate password - fix method name
UserSchema.methods.validatePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// Virtual for average rating
UserSchema.virtual('averageRating').get(function() {
  return this.ratingCount > 0 ? this.ratingSum / this.ratingCount : 0;
});

// Pre-save hook to set the name field
UserSchema.pre('save', function(next) {
  if (this.firstName || this.lastName) {
    this.name = `${this.firstName || ''} ${this.lastName || ''}`.trim();
  }
  next();
});

// Only compile model if it hasn't been compiled before
const User = mongoose.models.User || mongoose.model('User', UserSchema);

module.exports = User;

// Add this after your routes
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});
