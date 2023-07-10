import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { register, login, logout, deleteAccount } from '../controllers/auth.js';
import { body } from 'express-validator'

const router = express.Router();

router.post(
    '/register', 
    body('email').trim()
                    .notEmpty()
                    .withMessage("Email can't be empty.")
                    .bail()
                    .isEmail()
                    .withMessage("Email is invalid"),
    body('password').notEmpty()
                    .withMessage("Password can't be empty.")
                    .bail()
                    .isLength({min: 8})
                    .withMessage("Password MUST be at least 8 characters long."), 
    register
);


router.post(
    '/login', 
    body('email').trim()
                .notEmpty()
                .withMessage("Email can't be empty.")
                .bail()
                .isEmail()
                .withMessage("Email is invalid"),
    body('password').notEmpty()
                    .withMessage("Password can't be empty.")
                    .bail()
                    .isLength({min: 8})
                    .withMessage("Password MUST be at least 8 characters long.")
    , login
);

router.get('/logout', verifyToken, logout);

router.get('/delete', verifyToken, deleteAccount);

export default router;