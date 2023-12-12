const jwt = require('jsonwebtoken')

module.exports = function (req, res, next){
    let token = req.header('Authorization')
    if(!token) return res.status(401).send('Access denied. No token provided')
    token = token.split(' ')[1]

    try {
        const decoded = jwt.verify(token, '&mikrobot_key@')
        req.auth = decoded
        next()
    } catch (error) {
        res.status(400).send('invalid token')
    }
}

