const { body } = require('express-validator');
const Admin = require('../models/adminModel');

const signUpAdminValidate = [
  body('full_name')
    .notEmpty()
    .withMessage('Full name filed is required.')
    .bail()
    .isLength({ min: 3 })
    .withMessage('Name must be three character'),
  body('email')
    .notEmpty()
    .withMessage('Email filed is required.')
    .bail()
    .isEmail()
    .withMessage('Please enter a valid email')
    .custom(value => {
      return Admin.findOne({ email: value }).then(user => {
        if (user) {
          return Promise.reject('Email is already registered.');
        }
      });
    }),
  body('type')
    .isIn(['admin', 'role'])
    .withMessage('Type is must be admin or role.'),
  body('contact_no')
    .optional({ checkFalsy: true })
    .isNumeric()
    .bail()
    .withMessage('Contact number have only numbers.')
    .bail()
    .isLength({ min: 10, max: 10 })
    .withMessage('Contact number is must be 10 digits.')
];

const loginAdminValidation = [
  body('email')
    .notEmpty()
    .withMessage('Email filed is required.')
    .bail()
    .isEmail()
    .withMessage('Please enter a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required.')
    .bail()
    .isLength({ min: 5 })
    .withMessage('Passowrd is minimum 5 characters.')
];

const updateAdminProfile = [
  body('full_name')
    .optional({ checkFalsy: true })
    .notEmpty()
    .withMessage('Full name filed is required.')
    .bail()
    .isLength({ min: 3 })
    .withMessage('Name must be three character'),
  body('email')
    .optional({ checkFalsy: true })
    .notEmpty()
    .withMessage('Email filed is required.')
    .bail()
    .isEmail()
    .withMessage('Please enter a valid email')
    .custom(value => {
      return Admin.findOne({ email: value }).then(user => {
        if (user) {
          return Promise.reject('Email is already registered.');
        }
      });
    }),
  body('contact_no')
    .optional({ checkFalsy: true })
    .isNumeric()
    .bail()
    .withMessage('Contact number have only numbers.')
    .bail()
    .isLength({ min: 10, max: 10 })
    .withMessage('Contact number is must be 10 digits.')
];
module.exports = {
  signUpAdminValidate,
  loginAdminValidation,
  updateAdminProfile
};
