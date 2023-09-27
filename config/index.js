const dayjs = require('dayjs')
const ip = require('ip')
// 运行的端口号
exports.port = 3002
/**
 * 成功时返回的统一数据格式
 * @param data
 * @param path
 */
exports.okResult = (data, path) => {
    return {
        status: true,
        errMsg: '',
        errorCode: '',
        content: {
            head: {
                LOG_NAME: path,
                SVR_IP: ip.address(),
                errorCode: data.errorCode || '00',
                errorStatus: '1',
                sysDate: dayjs().format('YYYY-MM-DD HH:mm:ss.SSS')
            },
            data
        }
    }
}
/**
 * 错误时返回的统一数据格式
 * @param logPath
 * @param errMessage
 * @param errorCode
 */
exports.errorResult = ({logPath, errMessage, errorCode = '9999'}) => {
    return {
        status: '-1',
        errMsg: '',
        errorCode: '',
        content: {
            head: {
                LOG_NAME: logPath,
                SVR_IP: ip.address(),
                errorCode: errorCode,
                errorStatus: '1',
                sysDate: dayjs().format('YYYY-MM-DD HH:mm:ss.SSS')
            },
            data: {
                errMessage
            }
        }
    }
}
// 不需要token的接口白名单
exports.whiteList = [
    '/login'
]
