// const jwt = require("jsonwebtoken");
// const authenticateJWT = (req, res, next) => {
//     const authHeader = req.headers.authorization;
//     if (authHeader) {
//         const token = authHeader.split(' ')[1];
//         jwt.verify(token, process.env.JWT_SECRETS, (err, user) => {
//             if (err) {
//                 return res.status(401).json({
//                     "data": null,
//                     "meta": {
//                         "message": "Unauthorized user " + err,
//                     }
//                 });
//             }
//             req.user = user;
//             next();
//         });
//     } else {
//         res.status(401).json({
//             "data": null,
//             "meta": {
//                 "message": "Unauthorized user",
//             }
//         });
//     }
// };

// module.exports = authenticateJWT;

const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Admin = require('../models/adminModel');

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError('You are not logged in ! Please log in to get access.', 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check it user still exists
  const currentUser = await Admin.findById(decoded.id);
  if (!currentUser) {
    return next('The user belonging to this token does no longer exist.', 401);
  }

  // 4)Check if user change password after the token was issued
  // if (currentUser.changedPasswordAfter(decoded.iat)) {
  //     return next(
  //         new AppError('User recently changed password! Please log in again', 401)
  //     );
  // }

  // GRANT ACCESS TO PROTECTED ROUTES
  req.user = currentUser;
  // res.locals.user = currentUser;

  next();
});
