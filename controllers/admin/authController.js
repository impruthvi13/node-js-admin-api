// const crypto = require('crypto');
// const { promisify } = require('util');
const jwt = require('jsonwebtoken');
// const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');
// const Email = require('../../utils/email');
const Admin = require('../../models/adminModel');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user, statusCode, req, res, msg = '') => {
  const token = signToken(user._id);
  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
  });
  // remove passwrd form output
  user.password = undefined;
  res.header('Access-Control-Expose-Headers', 'X-Authorization-Token');
  res.header('X-Authorization-Token', token);
  res.status(statusCode).json({
    data: {
      id: user.id,
      full_name: `${user.full_name}`,
      contact_no: user.contact_no || '',
      email: user.email,
      profile_photo: user.profile_photo
    },
    meta: {
      message: msg
    }
  });
};

const adminRegister = catchAsync(async (req, res, next) => {
  const newAdminUser = await Admin.create({
    full_name: req.body.full_name,
    email: req.body.email,
    contact_no: req.body.contact_no,
    password: req.body.password,
    is_active: req.body.is_active,
    type: req.body.type
  });
  const msg = 'Admin register successfully.';
  createSendToken(newAdminUser, 201, req, res, msg);
});

const adminLogin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 2) Check if user exists && password is correct
  const admin = await Admin.findOne({ email }).select('+password');
  if (!admin || !(await admin.currectPassword(password, admin.password))) {
    // return next(new AppError('Incorrect email or password'), 401);
    res.status(401).json({
      data: null,
      meta: {
        message: 'Incorrect email or password'
      }
    });
  }
  const msg = 'Admin is login successfully.';
  createSendToken(admin, 200, req, res, msg);
});

const adminEditProfile = catchAsync(async (req, res, next) => {
  // res.hea
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  const updateId = jwt.decode(token).id;
  const updatedData = await Admin.findByIdAndUpdate(updateId, req.body, {
    new: true
  });

  // here we are writing the new : true because it is return the new updated object
  const msg = 'Admin profile details updated successfully.';
  createSendToken(updatedData, 200, req, res, msg);
});

// logout = (req, res) => {
//   res.cookie('jwt', 'loggedout', {
//     expires: new Date(Date.now() + 10 * 1000),
//     httpOnly: true
//   });
//   res.status(200).json({ status: 'success' });
// };

// Only for rendered pages, no errors!
// const isLoggedIn = async (req, res, next) => {
//   try {
//     // 1)Verify token
//     if (req.cookies.jwt) {
//       const decoded = await promisify(jwt.verify)(
//         req.cookies.jwt,
//         process.env.JWT_SECRET
//       );

//       // 2) Check it user still exists
//       const currentUser = await Admin.findById(decoded.id);
//       if (!currentUser) {
//         return next();
//       }

//       // 3)Check if user change password after the token was issued
//       if (currentUser.changedPasswordAfter(decoded.iat)) {
//         return next();
//       }

//       // THERE IS A LOGGED IN USER
//       res.locals.user = currentUser;
//       return next();
//     }
//   } catch (e) {
//     return next();
//   }
//   next();
// };

// const restrictTo = (...roles) => {
//   return (req, res, next) => {
//     // roles ['admin','lead-guide']. role = 'user'
//     if (!roles.includes(req.user.role)) {
//       return next(
//         new AppError('You do not have permission to perform this action', 403)
//       );
//     }
//     next();
//   };
// };

// const forgotPassword = async (req, res, next) => {
//   // 1) Get User Based on POSEed Email
//   const user = await User.findOne({ email: req.body.email });
//   if (!user) {
//     return next(new AppError('This is no user with this email address', 404));
//   }

//   // 2) Genrate the random reset token
//   const resetToken = user.createResetPasswordToken();
//   await user.save({ validateBeforeSave: false });

//   // 3) Send it to user's email

//   try {
//     const resetURL = `${req.protocol}://${req.get(
//       'host'
//     )}/api/v1/users/resetPassword/${resetToken}`;
//     await new Email(user, resetURL).sendPasswordReset();

//     res.status(200).json({
//       meta: {
//         message: 'Token send to email'
//       }
//     });
//   } catch (err) {
//     user.passwordResetToken = undefined;
//     user.passwordResetExpires = undefined;
//     await user.save({ validateBeforeSave: false });
//     return next(
//       AppError('There was an error sending the email. Try again leater!', 500)
//     );
//   }
// };

// const resetPassword = async (req, res, next) => {
//   // 1) Get user based on the token
//   const hashedToken = crypto
//     .createHash('sha256')
//     .update(req.params.token)
//     .digest('hex');

//   const user = await User.findOne({
//     passwordResetToken: hashedToken,
//     passwordResetExpires: { $gt: Date.now() }
//   });

//   // 2) If token has not expired, and there is user, ser new password
//   if (!user) {
//     return next(new AppError('Token is invalid or expired', 400));
//   }
//   user.password = req.body.password;
//   user.passwordConfirm = req.body.passwordConfirm;
//   user.passwordResetToken = undefined;
//   user.passwordResetExpires = undefined;
//   await user.save();

//   // 3) Update changePasswordAt property for the user
//   // 4) Log the user in, send JWT
//   createSendToken(user, 200, req, res);
// };

// const updatePassword = async (req, res, next) => {
//   // 1) Get user from collection
//   const user = await User.findById(req.user.id).select('+password');

//   // 2) Check if POSTed current password is correct
//   if (!(await user.currectPassword(req.body.currentPassword, user.password))) {
//     return next(new AppError('Your current password is incorrect', 401));
//   }

//   // 3) If so, update password
//   user.password = req.body.password;
//   user.passwordConfirm = req.body.passwordConfirm;
//   await user.save();

//   // 4) Log user in, send JWT
//   createSendToken(user, 200, req, res);
// };

module.exports = { adminRegister, adminLogin, adminEditProfile };
