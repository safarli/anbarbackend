const jwt = require('jsonwebtoken')


module.exports = function jwtGenerator(user_id, user_role) {
    const payload = {
        user: {
            id: user_id,
            role: user_role
        }
    }

    return jwt.sign(payload, process.env.jwtSecret, { expiresIn: 60 })
}
