import { Router } from 'express';
import upload from '../Middlewares/uploadImage.js';
import * as userController from '../Controllers/userController.js';
import { protect, restrictTo } from '../Middlewares/auth.middleware.js';

const router = Router();

router.route('/trainers')
  .get(userController.getAllTrainer);

// Protect all routes after this middleware
router.use(protect);

// Current user routes
router.get('/me', userController.getMe);
router.patch('/me', upload.single('profilePicture'), userController.updateMe);
router.delete('/delete-me', userController.deleteMe);

router.get('/me', userController.getMe);


// Admin-only routes
router.route('/')
  .get(restrictTo('admin'),  userController.getAllUsers);

router.route('/:id')
  .get(userController.getUser)
  .patch(restrictTo('admin'), userController.updateUser)
  .delete(restrictTo('admin'), userController.deleteUser);

export default router;
