const { genSaltSync, hashSync } = require('bcryptjs')

module.exports = function (password) {
    const salt = genSaltSync(10);
    return hashSync(password, salt);
}