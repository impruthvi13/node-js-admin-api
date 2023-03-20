const express = require('express');
const authController = require('./../controllers/authController');

const {
  adminRegister,
  adminLogin,
  adminEditProfile
} = require('./../controllers/admin/authController');
const {
  signUpAdminValidate,
  loginAdminValidation,
  updateAdminProfile
} = require('../validations/adminAuthValidation');
const validationMsg = require('../validations/validationMsg');
// const authenticateJWT = require('../middlewares/adminAuthMiddleware');

const router = express.Router();

// router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/admin/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

//admin auth routes
router.post( '/admin/register', signUpAdminValidate, validationMsg, adminRegister);
router.post('/admin/login', loginAdminValidation, validationMsg, adminLogin);
router.patch('/admin/edit-profile', updateAdminProfile, validationMsg, adminEditProfile);

module.exports = router;
