import { Router } from 'express';
import upload from '../Middlewares/uploadImage.js';
import * as authController from '../Controllers/authControllers.js';

const router = Router();

// Authentication routes
router.post('/register', upload.single('profilePicture'), authController.register);
router.post('/login', upload.none(), authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);

export default router;
