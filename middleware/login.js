const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    try {
        const bearer = req.headers.authorization.split(' ')[1]
        const decode = jwt.verify(bearer, process.env.JWT_TOKEN_KEY)
        req.user = decode;
        next()
    } catch (e) {
        return res.status(401).send({ status: 401, message: 'Authentication failed!' })
    }
}