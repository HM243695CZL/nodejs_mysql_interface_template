const setToken = require('../config/token')
const config = require('../config')
const db = require('../config/db-config')
const tableName = 'hw_user'
exports.login = (req, res, next) => {
    let {username, userId} = req.body
    setToken.setToken(username, userId).then(data => {
        const sql = `select * from ${tableName} where user_id = '${userId}'`
        db.query({
            req,
            sql,
            tableName,
            queryKey: 'user_id',
            queryValue: userId
        }).then(result => {
            const {email, mobile, user_id, username, status} = result.result[0];
             res.json(config.okResult({
                token: data,
                userInfo: {
                    email,
                    mobile,
                    user_id,
                    username,
                    status
                }
            }, ''));
        })
    })
}
exports.vertify = (req, res, next) => {
    if(req.data){
        res.json(config.okResult({
            message: '身份验证成功'
        }))
    }else{
        res.json(config.errorResult({
            logPath: '',
            errMessage: '未获取到用户信息'
        }))
    }
}
