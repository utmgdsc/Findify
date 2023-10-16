const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    contactNumber: { type: String },
    // TODO: Need to decide query limit
    queryLimit: { type: Number, default: 3 }
  },
  { timestamps: true }
);

// Hash the password before saving it to the database
userSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (error) {
    return next(error);
  }
});

userSchema.methods.hashPassword = async function (password) {
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

// Compare the given password with the hashed password in the database
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('user', userSchema);;