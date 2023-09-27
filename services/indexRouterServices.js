const dayjs = require('dayjs')
const db = require('../config/db-config')
const config = require('../config')
const uuid = require('node-uuid')
const tableName = 'hw_user'
// 查询用户
exports.getUserList = (req, res, next) => {
    let {username, page = 0, size = 10, user_id} = req.body
    console.log(req.data);
    let sql1 = `select * from ${tableName} where username like '%${username}%' limit ${page * size}, ${size}`
    let sql2 = `select * from ${tableName} where user_id = '${user_id}'`
    let sql = user_id ? sql2 : sql1
    db.query({
        req,
        sql,
        tableName,
        queryKey: 'user_id',
        queryValue: user_id
    }).then(data => {
        data.result.map((item, index) => {
            item.created = dayjs(item.created).format('YYYY-MM-DD HH:mm:ss')
        })
        res.json(config.okResult({
            list: data.result,
            total: data.total
        }, data.logPath))
    }, err => {
        res.json(config.errorResult({
            logPath: err.logPath,
            errMessage: err.message
        }));
    })
}
// 新增用户
exports.saveUser = (req, res, next) => {
    let {username, password, email, mobile} = req.body
    // 先查询数据是否已存在
    db.hasRepeat(req, tableName,'username', username)
        .then(data => {
            db.addData(
                req,
                tableName,
                'user_id, username, password, email, mobile, status, created',
                [uuid.v1(), username, password, email, mobile, '1', dayjs().format('YYYY-MM-DD HH:mm:ss')]
            ).then(data => {
                res.json(config.okResult({}, data.logPath))
            }, err => {
                res.json(config.errorResult({
                    logPath: err.logPath,
                    errMessage: err.message
                }));
            })
        }, err => {
            res.json(config.errorResult({
                logPath: err.logPath,
                errMessage: err.message
            }))
    })
}
// 修改用户
exports.updateUser = (req, res, next) => {
    let {user_id, username, password, email, mobile} = req.body
    db.hasRepeat(req, tableName, 'username', username)
        .then(data => {
            db.updateData(
                req,
                tableName,
                ['username', 'password', 'email', 'mobile'],
                'user_id',
                [username, password, email, mobile, user_id]
            ).then(data => {
                res.json(config.okResult({}, data.logPath))
            }, err => {
                res.json(config.errorResult({
                    logPath: err.logPath,
                    errMessage: err.message
                }));
            })
        },err => {
            res.json(config.errorResult({
                logPath: err.logPath,
                errMessage: err.message
            }))
        })
}
// 删除用户
exports.delUser = (req, res, next) => {
    let {user_id} = req.query
    db.delData(
        req,
        tableName,
        'user_id',
        user_id
    ).then(data => {
        res.json(config.okResult({}, data.logPath))
    }, err => {
        res.json(config.errorResult({
            logPath: err.logPath,
            errMessage: err.message
        }));
    })
}
