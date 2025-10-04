import { Router } from 'express';
import upload from '../Middlewares/uploadImage.js';
import * as userController from '../Controllers/userController.js';
import { protect, restrictTo } from '../Middlewares/auth.middleware.js';

const router = Router();

// Protect all routes after this middleware
router.use(protect);

// Current user routes
router.get('/me', userController.getMe);
router.patch('/update-me', upload.single('profilePicture'), userController.updateMe);
router.delete('/delete-me', userController.deleteMe);

router.get('/me', userController.getMe);
router.route('/top-trainers')
  .get(userController.getAllTrainer);


// Admin-only routes
router.use(restrictTo('admin'));
router.route('/')
  .get(userController.getAllUsers);

router.route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

export default router;
