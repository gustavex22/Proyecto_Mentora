const express = require('express');
const AuthController = require('../controllers/AuthController');
const authMiddleware = require('../middlewares/authMiddleware');

const api = express.Router();

api.post('/login', AuthController.login);
api.get('/me', authMiddleware, AuthController.getMe);
api.post('/refresh-token', authMiddleware, AuthController.refreshToken);

module.exports = api;
