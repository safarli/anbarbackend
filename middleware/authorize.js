const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const token = req.header("jwt_token");

    if (!token) {
        return res.status(403).json({ msg: "authorization denied" });
    }

    try {
        const verify = jwt.verify(token, process.env.jwtSecret);
        req.user = verify.user;
        next()
    }
    catch (e) {
        res.status(401).json({ msg: "Token is not valid" })
    }
}