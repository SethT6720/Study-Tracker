const jwt = require('jsonwebtoken');

async function authMiddleware(req, res, next) {
    let token = req.headers['authorization'];
    if (!token || !token.startsWith('Bearer')) {
        res.status(401).send('Authorization required');
        return;
    }
    token = token.split(' ')[1];
    try {
        let decode = jwt.verify(token, process.env.JWTSECRETKEY);
        req.user = decode;
        next();
    } catch (err) {
        res.status(401).send('Verification failed');
    }
}

module.exports = {
    authMiddleware: authMiddleware
};