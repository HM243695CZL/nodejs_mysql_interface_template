const dayjs = require('dayjs')
/**
 * 获取随机数
 * @param min
 * @param max
 * @return {number}
 */
function getRandom(min = 0, max = 100) {
    return Math.floor(Math.random() * (max - min)) + min
}

/**
 * 创建日志存储路径
 * @return {string}
 */
function createLogPath(){
    return './log/' + dayjs().format('YYYY-MM-DD') + '/hw_log_' +  getRandom() + '.log'
}

module.exports = {
    getRandom,
    createLogPath
}
