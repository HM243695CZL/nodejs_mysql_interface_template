const log4js = require('log4js')
function createLogInfo(logStr, logPath){
    // 写入日志
    log4js.configure(
        {
            appenders: {
                file: {
                    type: 'file',
                    filename: logPath,
                    maxLogSize: 10 * 1024 * 1024, // = 10Mb
                    backups: 5, // keep five backup files
                    compress: true, // compress the backups
                    encoding: 'utf-8',
                    mode: 0o0640,
                    flags: 'a'
                },
                out: {
                    type: 'stdout'
                }
            },
            categories: {
                default: { appenders: ['file', 'out'], level: 'trace' }
            }
        }
    );
    let logger = log4js.getLogger('anything');
    logger.debug(logStr)
}
module.exports = {
    createLogInfo
}
