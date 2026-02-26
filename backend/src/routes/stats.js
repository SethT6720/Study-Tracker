const { Router } = require('express');
const { getWeeklyStats, getMonthlyStats, getSubjectBreakdown, getMostStudiedSubject, getStudyStreak } = require('../controllers/statsController');
const { authMiddleware } = require('../middleware/auth');

const router = Router();
router.use(authMiddleware);

router.get('/weekly', getWeeklyStats);
router.get('/monthly', getMonthlyStats);
router.get('/subjects', getSubjectBreakdown);
router.get('/most-studied', getMostStudiedSubject);
router.get('/streak', getStudyStreak);

module.exports = router;