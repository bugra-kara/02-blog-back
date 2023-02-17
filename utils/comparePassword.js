const bcrypt = require('bcrypt');

const comparePassword = async function (canditatePassword, userPassword) {
    const isMatch = await bcrypt.compare(canditatePassword, userPassword)
    return isMatch
}
module.exports = comparePassword