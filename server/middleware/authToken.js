const jwt = require('jsonwebtoken');

module.exports = (req,res, next) => {
    const token = req.header('auth-token');
    if(!token) return res.status(401).send('Access denied');

    try {
        const verified = jwt.verify(token, 'secrettoken');
        req.user = verified;
        next();
    } catch (error) {
        console.log(error.message);
        res.status(400).send('Invalid token');
    }
}