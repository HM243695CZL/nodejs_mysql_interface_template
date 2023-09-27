const mysql = require('mysql')
const dayjs = require('dayjs')
const tools = require('../../utils')

const logConfig = require('../log-config')
const databaseInfo = {
    host: "localhost",
    user: "root",
    password: "root",
    database: "db_self"
}

const pool = mysql.createPool(databaseInfo)
// 数据库连接配置
module.exports = {
    /**
     * 查询数据
     * @param req 请求信息
     * @param sql sql语句
     * @param tableName 表名
     * @param queryKey 当修改时前端传递的查询字段
     * @param queryValue 当修改时前端传递的查询字段值
     */
    query: ({req, sql, tableName, queryKey, queryValue}) => {
        let date = dayjs().format('YYYY-MM-DD HH:mm:ss.SSS')
        const logPath = tools.createLogPath()
        let sqlCount = queryValue === undefined ? `select count(*) as total from ${tableName}` :
            `select count(*) as total from ${tableName} where ${queryKey} = '${queryValue}'`
        let logStr = `
    日志：${logPath.slice(6)}
    地址：${req.url}
    请求方式：${req.method}
    请求参数：${req.method === 'GET' ? JSON.stringify(req.query) : JSON.stringify(req.body)}
    类型：查询
    说明：查询数据
    时间： ${date}
    数量：${sqlCount}
    语句：${sql}`
        return new Promise(((resolve, reject) => {
            pool.query(sql, (err, result) => {
                // 查询个数
                pool.query(sqlCount, (e, count) => {
                    if(err || e){
                        logStr += `
    详情：${err.message || e.message}
    状态：错误`
                        reject({
                            logPath: logPath.slice(6),
                            message: err.message || e.message,
                        })
                    }else{
                        logStr += `
    状态：成功`
                        resolve({
                            logPath: logPath.slice(6),
                            result,
                            total: count[0].total
                        })
                    }
                    logConfig.createLogInfo(logStr, logPath)
                })
            })
        }))
    },
    /**
     *
     * @param req 请求信息
     * @param tableName 表名
     * @param queryKey 查询的字段名
     * @param queryValue 查询的字段值
     */
    hasRepeat(req, tableName, queryKey, queryValue){
        let sql = `select * from ${tableName} where ${queryKey} = '${queryValue}'`
        const logPath = tools.createLogPath()
        let date = dayjs().format('YYYY-MM-DD HH:mm:ss.SSS')
        let logStr = `
    日志：${logPath.slice(6)}
    地址：${req.url}
    请求方式：${req.method}
    请求参数：${req.method === 'GET' ? JSON.stringify(req.query) : JSON.stringify(req.body)}
    类型：查询
    说明：新增或修改前查询是否有重复值
    时间： ${date}
    语句：${sql}`

        return new Promise(((resolve, reject) => {
            pool.query(sql, (err, result) => {
                if(err){
                    logStr += `
    详情：${err.message}    
    状态：错误`
                    reject({
                        logPath: logPath.slice(6),
                        message: err.message
                    })
                }else{
                    if(result.length === 1){
                        // 已有数据，不能新增
                        logStr += `
    状态：查询成功，但有重复值`
                        reject({
                            logPath: logPath.slice(6),
                            message: `'${queryKey}'字段不能重复`
                        })
                    }else{
                        logStr += `
    状态：成功`
                        resolve()
                    }
                }
                logConfig.createLogInfo(logStr, logPath)
            })
        }))
    },
    /**
     * 新增数据
     * @param req 请求信息
     * @param tableName 表名
     * @param field
     * @param data 字段对应的值
     */
    addData: (req, tableName, field, data) => {
        const logPath = tools.createLogPath()
        let date = dayjs().format('YYYY-MM-DD HH:mm:ss.SSS')
        let bit = '' // 构建语句的?
        for (let i = 0; i < field.split(',').length; i++){
            if(i === field.split(',').length - 1){
                bit += '?'
            }else{
                bit += '?, '
            }
        }
        let sql = `insert into ${tableName} (${field}) values(${bit})`
        let logStr = `
    日志：${logPath.slice(6)}
    地址：${req.url}
    请求方式：${req.method}
    请求参数：${req.method === 'GET' ? JSON.stringify(req.query) : JSON.stringify(req.body)}
    类型：新增
    说明：新增数据
    时间：${date}
    数据：${data}
    语句：${sql}`

        return new Promise(((resolve, reject) => {
            pool.query(sql, data, (err, result) => {
                if(err){
                    logStr += `
    详情：${err.message}
    状态：错误`
                    reject({
                        logPath: logPath.slice(6),
                        message: err.message
                    })
                }else{
                    logStr += `
    状态：成功`
                    resolve({
                        logPath: logPath.slice(6),
                        result
                    })
                }
                logConfig.createLogInfo(logStr, logPath)
            })
        }))
    },
    /**
     * 更新数据
     * @param req 请求信息
     * @param tableName 表名
     * @param field 字段
     * @param conditionField 条件字段
     * @param data 字段对应的值
     */
    updateData: (req, tableName, field, conditionField, data) => {
        const logPath = tools.createLogPath()
        let date = dayjs().format('YYYY-MM-DD HH:mm:ss.SSS')
        let bit = '' // 构建语句的?
        for (let i = 0; i < field.length; i++){
            if(i === field.length - 1){
                bit += field[i] + ' = ?'
            }else{
                bit += field[i] + ' = ?, '
            }
        }
        let sql = `update ${tableName} set ${bit} where ${conditionField} = ?`
        let logStr = `
    日志：${logPath.slice(6)}
    地址：${req.url}
    请求方式：${req.method}
    请求参数：${req.method === 'GET' ? JSON.stringify(req.query) : JSON.stringify(req.body)}
    类型：更新
    说明：更新数据
    时间：${date}
    数据：${data}
    语句：${sql}`
        return new Promise(((resolve, reject) => {
            pool.query(sql, data, (err, result) => {
                if(err){
                    logStr +=`
    详情：${err.message}
    状态：错误`
                    reject({
                        logPath: logPath.slice(6),
                        message: err.message
                    })
                }else{
                    logStr += `
    状态：成功`
                    resolve({
                        logPath: logPath.slice(6),
                        result
                    })
                }
                logConfig.createLogInfo(logStr, logPath)
            })
        }))
    },
    /**
     * 删除数据
     * @param req 请求信息
     * @param tableName 表名
     * @param field 字段
     * @param data 字段对应的值
     */
    delData: (req, tableName, field, data) => {
        const logPath = tools.createLogPath()
        let date = dayjs().format('YYYY-MM-DD HH:mm:ss.SSS')

        let sql = `delete from ${tableName} where ${field} = ?`
        let logStr = `
    日志：${logPath.slice(6)}
    地址：${req.url}
    请求方式：${req.method}
    请求参数：${req.method === 'GET' ? JSON.stringify(req.query) : JSON.stringify(req.body)}
    类型：删除
    说明：删除数据
    时间：${date}
    数据：${data}
    语句：${sql}`
        return new Promise(((resolve, reject) => {
            pool.query(sql, [data], (err, result) => {
                if(err){
                    logStr += `
    详情：${err.message}
    状态：错误`
                    reject({
                        logPath: logPath.slice(6),
                        message: err.message
                    })
                }else{
                    logStr += `
    状态：成功`
                    resolve({
                        logPath: logPath.slice(6),
                        result
                    })
                }
                logConfig.createLogInfo(logStr, logPath)
            })
        }))
    }
}
