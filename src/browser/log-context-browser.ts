import { isBrowser } from "../common/platform"
import { Logger } from "../common/log"
import {
  LoggerBrowserHandler,
  LoggerBrowserSetupDebugFactory,
} from "./log-browser"

// todo sideffects
export function setupBrowserLog() {
  if (isBrowser()) {
    Logger.setHandlers([LoggerBrowserHandler()]) // Fallback for previously registered Loggers
    Logger.setFactory(LoggerBrowserSetupDebugFactory({}))
  }
}

setupBrowserLog()
