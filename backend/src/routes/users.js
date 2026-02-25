const { Router } = require('express');
const { createUser, getUser } = require('../controllers/usersController');

const router = Router();

router.post('/', createUser);

router.get('/:id', getUser);

module.exports = router;