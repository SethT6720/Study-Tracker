const { Router } = require('express');
const { createSession, getSessions, editSession, deleteSession } = require('../controllers/sessionsController');

const router = Router();

router.post('/', createSession);

router.get('/:user_id', getSessions);

router.patch('/:id', editSession);

router.delete('/:id', deleteSession);

module.exports = router;