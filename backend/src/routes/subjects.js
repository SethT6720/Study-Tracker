const { Router } = require('express');
const { createSubject, getSubject, editSubject, deleteSubject } = require('../controllers/subjectsController');
const { authMiddleware } = require('../middleware/auth');

const router = Router();
router.use(authMiddleware);

router.post('/', createSubject);

router.get('/', getSubject);

router.patch('/:id', editSubject);

router.delete('/:id', deleteSubject);

module.exports = router;