import log4js from 'log4js'
import * as fs from 'fs'
import * as path from 'path'

export const logger = log4js.getLogger()
logger.level = 'debug'

export const mkDir = fsPath => {
  const dirPath = path.dirname(fsPath)
  !fs.existsSync(dirPath) && fs.mkdirSync(dirPath)
}
