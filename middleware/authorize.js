const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const authHeader = req.header("Authorization")
    let authHeaderSplit = []
    let authType, authToken = null;

    if (!authHeader) {
        return res.status(403).json({ msg: "authorization denied" })
    }

    authHeaderSplit = authHeader.split(' ')
    authType = authHeaderSplit[0]
    authToken = authHeaderSplit[1]

    if (authType !== "Bearer") {
        return res.status(403).json({ msg: "Bearer token expected" })
    }

    try {
        const verify = jwt.verify(authToken, process.env.jwtSecret);
        req.user = verify.user;
        next()
    }
    catch (e) {
        res.status(401).json({ msg: "Token is not valid" })
    }
}
