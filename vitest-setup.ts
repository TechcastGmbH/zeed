import * as crypto from 'crypto'

// @ts-expect-error Workaround
globalThis.isNodeTestEnv = true

if (globalThis.crypto == null) {
  // @ts-expect-error Workaround
  globalThis.crypto = crypto.webcrypto
}