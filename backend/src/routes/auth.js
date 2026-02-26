const { Router } = require('express');
const { login } = require('../controllers/authController');
const { rateLimit } = require('express-rate-limit');

const router = Router();
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 15,
    standardHeaders: true,
    legacyHeaders: false,
    ipv6Subnet: 56
});

router.use(limiter);
router.post('/login', login);

module.exports = router;