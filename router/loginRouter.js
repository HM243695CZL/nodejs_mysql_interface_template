const express = require('express')
const loginRouter = express.Router()
const loginRouterServices = require('../services/loginRouterServices')
loginRouter.post('/login', loginRouterServices.login)
module.exports = loginRouter
