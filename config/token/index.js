const jwt = require('jsonwebtoken')
const singKey = 'hm243695czl'
exports.setToken = (username, userId) => {
    return new Promise(((resolve, reject) => {
        const token = jwt.sign({
            name: username,
            _id: userId
        }, singKey, { expiresIn: '0.1h'})
        resolve(token)
    }))
}
exports.verToken = token => {
    return new Promise(((resolve, reject) => {
        const info = jwt.verify(token.split(' ')[1], singKey)
        resolve(info)
    }))
}
