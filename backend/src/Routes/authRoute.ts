import { Router } from 'express';
import upload from '../Middlewares/uploadImage.js';
import * as authController from '../Controllers/authControllers.js';

const router = Router();

// Authentication routes
router.post('/signup', upload.single('profilePicture'), authController.signup);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);

export default router;
