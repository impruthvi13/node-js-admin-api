const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// name,email,profile_photo,passowrd
const adminSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      required: [true, 'Please enter your full name']
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email']
    },
    contact_no: {
      type: String,
      validate: [validator.isMobilePhone, 'Please provide a valid number']
    },
    password: {
      type: String,
      required: [true, 'Please provide a passowrd'],
      minlength: 8,
      select: false
    },
    permissions: {
      type: Object,
      default: null
    },
    is_active: {
      type: Boolean,
      default: true,
      select: false
    },
    type: {
      type: String,
      enum: ['admin', 'role'],
      required: [true, 'Please enter only admin and role']
    },
    profile: {
      type: String,
      default: null
    },
    remember_token: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

adminSchema.pre('save', async function(next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  //   Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  //   Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

adminSchema.pre('save', async function(next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

adminSchema.pre(/^find/, function(next) {
  this.find({ active: { $ne: false } });
  next();
});
adminSchema.methods.currectPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

adminSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  // False means not changed
  return false;
};

adminSchema.methods.createResetPasswordToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  // console.log({ resetToken }, this.passwordResetToken);
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const Admin = mongoose.model('admin', adminSchema);
module.exports = Admin;
