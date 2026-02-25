const { Router } = require('express');
const { createSubject, getSubject, editSubject, deleteSubject } = require('../controllers/subjectsController');

const router = Router();

router.post('/', createSubject);

router.get('/:user_id', getSubject);

router.patch('/:id', editSubject);

router.delete('/:id', deleteSubject);

module.exports = router;