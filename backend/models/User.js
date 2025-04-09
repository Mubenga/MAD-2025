const mongoose = require('mongoose');
const validator = require('validator');

const UserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Name is required'],
    trim: true 
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Invalid email'],
    trim: true
  },
  mobile: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return /^[0-9]{10,15}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Minimum 6 characters required'],
    select: false
  },
  role: {
    type: String,
    enum: ['admin', 'instructor', 'student'],  // ✅ updated here
    default: 'student'                         // ✅ default to student
  }
}, { timestamps: true });

// Password comparison
UserSchema.methods.checkPassword = async function(candidatePassword) {
  return candidatePassword === this.password;
};

module.exports = mongoose.model('User', UserSchema);
