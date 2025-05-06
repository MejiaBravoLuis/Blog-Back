import { Router } from 'express';
import { login, register } from './auth.controller.js'
import { registerValidator, loginValidator } from '../middlewares/validator.js';
import { existUsername } from '../helpers/db-validator.js';
import { check } from 'express-validator';

const router = Router();

router.post(
    '/login',
    loginValidator,
    login
);

router.post(
    '/register',
    registerValidator,
    check("username").custom(existUsername),
    register
);

export default router;