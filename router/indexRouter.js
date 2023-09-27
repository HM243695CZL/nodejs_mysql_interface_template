const express = require('express')
const indexRouter = express.Router()
const indexRouterServices = require('../services/indexRouterServices')
indexRouter.post('/user/list', indexRouterServices.getUserList)
indexRouter.post('/user/save', indexRouterServices.saveUser)
indexRouter.post('/user/update', indexRouterServices.updateUser)
indexRouter.get('/user/del', indexRouterServices.delUser)
module.exports = indexRouter
