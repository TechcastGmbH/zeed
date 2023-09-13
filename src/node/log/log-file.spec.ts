// (C)opyright 2021-07-15 Dirk Holtwick, holtwick.it. All rights reserved.

/* eslint-disable n/no-path-concat */

import { rmSync, statSync, unlinkSync } from 'fs'
import { sleep } from '../../common/exec/promise'
import { DefaultLogger, LogLevelAll, getGlobalLogger } from '../../common/log'
import { LoggerFileHandler } from './log-file'

describe('Log File', () => {
  afterAll(() => {
    rmSync(`${__dirname}/tmp`, { recursive: true, force: true })
  })

  it('should write log', async () => {
    const path = `${__dirname}/tmp/test.log`
    getGlobalLogger().setHandlers([
      LoggerFileHandler(path, {
        level: LogLevelAll,
        filter: '*',
      }),
    ])
    const log = DefaultLogger('test')
    log('debug')
    log.info('info')
    log.warn('warn')
    log.error('error')
    await sleep(1000)
    expect(statSync(path).size).toBeGreaterThan(100)
    unlinkSync(path)
  })
})