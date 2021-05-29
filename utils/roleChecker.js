function sanitize(role) {
    return role.replace(/\s+/g, '')
}
module.exports.isAdminUser = function (role) {
    return (sanitize(role) === 'A') || false;
}

module.exports.isStandartUser = function (role) {
    return (sanitize(role) === 'S') || false;
}

module.exports.isGuestUser = function (role) {
    return (sanitize(role) === 'G') || false;
}