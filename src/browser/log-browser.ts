import { formatMilliseconds, getTimestamp } from "../common/time"
import {
  Logger,
  LoggerInterface,
  LogHandler,
  LogLevel,
  LogMessage,
} from "../common/log"

import { selectColor, supportsColors } from "./colors"

const styleFont = `font-family: "JetBrains Mono", Menlo; font-size: 11px;`
const styleDefault = `${styleFont}`
const styleBold = `font-weight: 600; ${styleFont}`
const useColors = supportsColors()

let namespaces: Record<string, any> = {}

let time = getTimestamp()

export function LoggerBrowserHandler(
  level: LogLevel = LogLevel.debug,
  opt: {
    colors: boolean
    levelHelper: boolean
    nameBrackets: boolean
    padding: number
  } = {
    colors: true,
    levelHelper: false,
    nameBrackets: true,
    padding: 16,
  }
): LogHandler {
  return (msg: LogMessage) => {
    if (msg.level < level) return

    const timeNow = getTimestamp()
    let name = msg.name || ""
    let ninfo = namespaces[name || ""]
    if (ninfo == null) {
      ninfo = {
        color: selectColor(name),
        // time: timeNow
      }
      namespaces[name] = ninfo
    }
    const diff = formatMilliseconds(timeNow - time)
    let styles: string[] = []
    let args: string[]

    if (opt.padding > 0) {
      name = name.padEnd(16, " ")
    }

    if (opt.colors && useColors) {
      args = [`%c${name}%c \t%s`]
      styles.push(`color:${ninfo.color}; ${styleBold}`)
      styles.push(styleDefault)
      args.push(...msg.messages)
    } else {
      args = [name, ...msg.messages]
    }

    if (opt.colors && useColors) {
      args.push(`%c+${diff}`)
      styles.push(`color:${ninfo.color};`)
    } else {
      args.push(`+${diff}`)
    }

    function consoleArgs(args: any[] = []): any[] {
      return [
        args
          .filter((a) => typeof a === "string")
          .map((a) => String(a))
          .join(" "),
        ...styles,
        ...args.filter((a) => typeof a !== "string"),
      ]
    }

    switch (msg.level) {
      case LogLevel.info:
        if (opt.levelHelper) args[0] = `I|*   ` + args[0]
        console.info(...consoleArgs(args))
        break
      case LogLevel.warn:
        if (opt.levelHelper) args[0] = `W|**  ` + args[0]
        console.warn(...consoleArgs(args))
        break
      case LogLevel.error:
        if (opt.levelHelper) args[0] = `E|*** ` + args[0]
        console.error(...consoleArgs(args))
        break
      default:
        if (opt.levelHelper) args[0] = `D|    ` + args[0]
        console.debug(...consoleArgs(args))
        break
    }
  }
}

/// The trick is, that console called directly provides a reference to the source code.
/// For the regular implementation this information is lost. But this approach has other
/// drawbacks, therefore only use it in the Browser when actively debugging.
function LoggerBrowserDebugFactory(name: string = ""): LoggerInterface {
  let fixedArgs = []
  if (useColors) {
    const color = selectColor(name)
    fixedArgs.push(`%c${name.padEnd(16, " ")}%c \t%s`)
    fixedArgs.push(`color:${color}; ${styleBold}`)
    fixedArgs.push(styleDefault)
  } else {
    fixedArgs.push(`[${name}] \t%s`)
  }
  let log = console.debug.bind(console, ...fixedArgs) as LoggerInterface
  log.info = console.info.bind(console, ...fixedArgs)
  log.warn = console.warn.bind(console, ...fixedArgs)
  log.error = console.error.bind(console, ...fixedArgs)
  return log
}

export function activateConsoleDebug() {
  Logger.setHandlers([LoggerBrowserHandler()]) // Fallback for previously registered Loggers
  Logger.setFactory(LoggerBrowserDebugFactory)
}

// let klass = console
// let debug = console.debug.bind(window.console, klass.toString() + ": ")

// debug("test")
// console.debug("test2")

// let dd
// if (Function.prototype.bind) {
//   dd = Function.prototype.bind.call(console.log, console)
// } else {
//   dd = function () {
//     Function.prototype.apply.call(console.log, console, arguments)
//   }
// }

// dd("dd")

// let c = 1
// Object.defineProperty(window, "log2", {
//   get: () => {
//     return console.log.bind(
//       window.console,
//       "%c[log]%c %s" + c++,
//       "color:red",
//       ""
//     )
//   },
// })

// // usage:
// log2("Back to the future")
// log2("Back to the future")

// let plog = new Proxy(console.debug, {
//   apply: function (target, that, args) {
//     target.apply(that, args)
//     // base.apply(that, args);
//   },
// })

// let cons = console.debug
// let plog = (...args) => {
//   cons.apply(window.console, ["|", ...args])
// }

// plog("xxx")

// function a() {
//   var err = new Error()
//   var caller_line = err.stack.split("\n")[2]
//   var index = caller_line.indexOf("at ")
//   var clean = caller_line.slice(index + 2, caller_line.length)
//   clean = clean.replace(/\?t=\d+/, "").replace("@fs/", "")
//   console.log(clean)
//   console.log(
//     "http://localhost:8080/Users/dirk/work/viidoo/lib/src/browser/log-browser.ts:188:1 log-browser.ts:291:10"
//   )
// }
// function b() {
//   a()
// }
// b()
