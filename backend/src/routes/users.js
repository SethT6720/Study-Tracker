const { Router } = require('express');
const { createUser, getUser } = require('../controllers/usersController');
const { authMiddleware } = require('../middleware/auth');

const router = Router();

router.post('/', createUser);

router.get('/', authMiddleware, getUser);

module.exports = router;