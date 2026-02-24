const { Router } = require('express');
const createUser = require('../controllers/usersController');

const router = Router();

router.post('/', createUser);

router.get('/:id', (req, res) => {

});

module.exports = router;