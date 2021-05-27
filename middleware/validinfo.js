const validator = require("validator");

module.exports = function (req, res, next) {
    const { email, name, password } = req.body;

    switch (req.path) {
        case "/register":
            if (![email, name, password].every(Boolean)) {
                return res.json('Missing credentials')
            }
            else if (!validator.isEmail(email)) {
                return res.json('Invalid email')
            }
        case "/login":
            if (![email, password].every(Boolean)) {
                return res.json("Missing credentials")
            }
            else if (!validator.isEmail(email)) {
                return res.json("Invalid email")
            }
    }
    next();

}