const { Router } = require('express');
const { createSession, getSessions, editSession, deleteSession } = require('../controllers/sessionsController');
const { authMiddleware } = require('../middleware/auth');

const router = Router();
router.use(authMiddleware);

router.post('/', createSession);

router.get('/', getSessions);

router.patch('/:id', editSession);

router.delete('/:id', deleteSession);

module.exports = router;