const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();
const adminAuthMiddleware = require('../middlewares/adminAuthMiddleware');
const validationMsg = require('../validations/validationMsg');
const { createUserValidation } = require('../validations/userValidation');
// Protect all the routes after this middleware
router.use(adminAuthMiddleware);
router.get('/admin/users', userController.getAllUsers);
router.get('/admin/users/:id', userController.getUser);
router.post(
  '/admin/users',
  createUserValidation,
  validationMsg,
  userController.addUsers
);

router.patch('admin/users/:id', userController.updateMe);
router.delete('/users/:id', userController.deleteMe);

router.patch('/updateMyPassword', authController.updatePassword);
router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);

router
  .get('admin/users/:id', userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
