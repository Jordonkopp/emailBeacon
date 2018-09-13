let winston = require('winston');
let path = require('path');

let logPath = __dirname;

const tsFormat = () => (new Date().toISOString());

const errorLog = (winston.createLogger)({
    transports: [
        new winston.transports.File({
            filename: path.join(logPath, 'errors.log'),
            timestamp: tsFormat,
            level: 'info'})
    ]
});

const accessLog = (winston.createLogger)({
    transports: [
        new winston.transports.File({
            filename: path.join(logPath, 'access.log'),
            timestamp: tsFormat,
            level: 'info'})
    ]
});

module.exports = {
    errorLog: errorLog,
    accessLog: accessLog
};