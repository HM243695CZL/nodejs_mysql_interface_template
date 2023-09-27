const express = require('express')
const app = express()
const cors = require('cors')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const config = require('./config')
const loginRouter = require('./router/loginRouter')
const indexRouter = require('./router/indexRouter')

const verToken = require('./config/token')
const expressJwt = require('express-jwt')
app.use(cors()) // 不加上这句代码跨域访问时会出现错误，加上就不会出现跨域错误情况
// 解析token获取用户信息
app.use((req, res, next) => {
    const token = req.headers['authorization']
    if(token === undefined){
        return next()
    }else{
        verToken.verToken(token).then(data => {
            // 将解析后的token保存到请求中
            req.data = data
            return next()
        }).catch(err => {
            return next()
        })
    }
})

// 验证token是否过期并规定白名单
app.use(expressJwt({
    secret: 'hm243695czl',
    algorithms: ['HS256']
}).unless({
    path: config.whiteList
}))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({limit: "10mb"}));

app.use(cookieParser())

// 登录
app.use(loginRouter)
// 主路由
app.use(indexRouter)

// 当token失效时返回提示信息
app.use((err, req, res, next) => {
    if(err.status === 401){
        res.json(config.errorResult({
            logPath: '',
            errMessage: 'token超时, status：401'
        }))
    }else{
        let error = new Error('Not Found')
        error.status = 404
        next(error)
    }
})
app.listen(config.port, () => {
    console.log("running in " + config.port +  " port...");
});
