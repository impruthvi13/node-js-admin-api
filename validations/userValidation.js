const { body } = require('express-validator');
const User = require('../models/userModel');

const createUserValidation = [
  body('first_name')
    .notEmpty()
    .withMessage('First Name is required.')
    .bail(),
  body('last_name')
    .notEmpty()
    .withMessage('Last Name is required.')
    .bail(),
  body('email')
    .notEmpty()
    .withMessage('Email filed is required.')
    .bail()
    .isEmail()
    .withMessage('Please enter proper email address.')
    .bail()
    .custom(value => {
      return User.findOne({ email: value }).then(user => {
        if (user) {
          return Promise.reject();
        }
      });
    })
    .withMessage('Email is already registered.'),
  body('contact_no')
    .notEmpty()
    .withMessage('Contact number is required.')
    .bail()
    .isNumeric()
    .withMessage('Contact Number is only digits.')
    .bail()
    .isLength({ min: 10, max: 10 })
    .withMessage('Contact number is must be 10 digits.')
    .bail(),
  body('password')
    .notEmpty()
    .withMessage('Password filed is required.')
    .bail()
    .isLength({ min: 6, max: 50 })
    .withMessage('Password required at least 6 digits.')
    .bail(),
  body('passwordConfirm')
    .notEmpty()
    .withMessage('Confirm password is required.')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('The confirm passwords do not match.')
];

const updateUserValidation = [
  body('first_name')
    .optional({ checkFalsy: true })
    .notEmpty()
    .withMessage('First Name is required.')
    .bail(),
  body('last_name')
    .optional({ checkFalsy: true })
    .notEmpty()
    .withMessage('Last Name is required.')
    .bail(),
  body('email')
    .optional({ checkFalsy: true })
    .notEmpty()
    .withMessage('Email filed is required.')
    .bail()
    .isEmail()
    .withMessage('Please enter proper email address.')
    .bail()
    .custom(async (value, { req }) => {
      const userData = await User.findById(req.params.id);
      let isResolved = false;
      if (userData && userData.email === value) {
        isResolved = true;
      } else {
        const alreadyEmail = await User.findOne({ email: value });
        if (alreadyEmail && alreadyEmail.email) {
          isResolved = false;
        }
      }
      return isResolved ? Promise.resolve() : Promise.reject();
    })
    .withMessage('Email is already taken by another user.')
];

module.exports = { createUserValidation, updateUserValidation };
