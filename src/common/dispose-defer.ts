import { isString } from './data'
import { arrayFilterInPlace } from './data/array'
import { isPromise } from './exec/promise'
import { DefaultLogger } from './log'
import type { LoggerInterface } from './log-base'

// https://blog.hediet.de/post/the_disposable_pattern_in_typescript

// todo adopt for `using` https://www.totaltypescript.com/typescript-5-2-new-keyword-using

export type DisposerFunction = () => any | Promise<any>

export type Disposer =
  | DisposerFunction
  | {
    dispose?: DisposerFunction | Promise<unknown>
    cleanup?: DisposerFunction | Promise<unknown> // deprecated, but used often in my old code
  }

export interface Disposable {
  dispose: UseDispose
}

/** Different kinds of implementations have grown, this should unify them  */
function callDisposer(disposable: Disposer): Promise<void> | void {
  let result

  if (typeof disposable === 'function')
    result = disposable()
  else if (isPromise(disposable))
    result = disposable
  else if (typeof disposable.dispose === 'function')
    result = disposable.dispose()
  else if (isPromise(disposable.dispose))
    result = disposable.dispose
  else if (typeof disposable.cleanup === 'function')
    result = disposable.cleanup()
  else if (isPromise(disposable.cleanup))
    result = disposable.cleanup

  if (isPromise(result))
    return result
}

interface UseDisposeConfig {
  name?: string
  log?: LoggerInterface
}

export function useDispose(config?: string | UseDisposeConfig | LoggerInterface) {
  let opt = config as any
  if (opt != null) {
    if (isString(opt))
      opt = { name: opt }
    else if ('debug' in opt && 'label' in opt)
      opt = { name: opt.label, log: opt }
  }

  const name = opt?.name
  const log = opt?.log ?? DefaultLogger('zeed:dispose')

  const tracked: Disposer[] = []

  function untrack(disposable: Disposer): Promise<void> | void {
    if (disposable != null && tracked.includes(disposable)) {
      arrayFilterInPlace(tracked, el => el !== disposable)
      const result = callDisposer(disposable)
      if (isPromise(result))
        return result
    }
  }

  function track(obj?: Disposer): DisposerFunction | undefined {
    if (obj == null)
      return
    tracked.unshift(obj) // LIFO
    return () => untrack(obj)
  }

  /** Dispose all tracked entries */
  function dispose(strictSync = false): Promise<any> | void {
    if (name)
      log.debug(`dispose "${name}": ${tracked.length} entries`)
    const promises: any[] = []
    while (tracked.length > 0) {
      const fn = tracked[0]
      const result = untrack(fn) // LIFO
      if (isPromise(result)) {
        if (strictSync)
          throw new Error(`Async disposable found: ${fn} -> ${result}`)
        else
          promises.push(result)
      }
    }

    if (promises.length > 0)
      return Promise.all(promises)
  }

  /** Dispose all tracked entries in synchronous way. */
  function disposeSync(): void {
    void dispose(true)
  }

  return Object.assign(dispose, {
    add: track,
    remove: untrack,

    /** @deprecated use add */
    track,

    /** @deprecated use remove */
    untrack,

    dispose,
    disposeSync,
    sync: disposeSync,

    /** @deprecated use dispose */
    exec: dispose,
    getSize() {
      return tracked.length
    },
    isDisposed() {
      return tracked.length <= 0
    },
  })
}

export type UseDispose = ReturnType<typeof useDispose>

export function useDefer(
  config: {
    mode?: 'lifo' | 'fifo'
  } = {},
) {
  const { mode = 'fifo' } = config
  const steps: Disposer[] = []

  /**
   * Excutes all steps. If all steps are not Promises, they are executed immediately,
   * otherwise a Promise is returned
   */
  const exec = async (expectSync = false) => {
    while (steps.length > 0) {
      const step = steps[0]
      arrayFilterInPlace(steps, el => el !== step)
      if (typeof step === 'function') {
        const result = step()
        if (isPromise(result)) {
          if (expectSync) {
            throw new Error(
              `Expected sync only function, but found async: ${step}`,
            )
          }
          await result
        }
      }
      else if (isPromise(step)) {
        if (expectSync) {
          throw new Error(
            `Expected sync only function, but found async: ${step}`,
          )
        }
        await step
      }
      else {
        throw new Error(`Unhandled disposable: ${step}`)
      }
    }
  }

  const add = (obj: Disposer) => {
    if (mode === 'lifo')
      steps.unshift(obj)
    else
      steps.push(obj)
  }

  return Object.assign(exec, {
    add,
    exec,
    getSize() {
      return steps.length
    },
  })
}

export type UseDefer = ReturnType<typeof useDefer>

export function useTimeout(
  fn: DisposerFunction,
  timeout = 0,
): DisposerFunction {
  let timeoutHandle: any = setTimeout(fn, timeout)
  return () => {
    if (timeoutHandle) {
      clearTimeout(timeoutHandle)
      timeoutHandle = undefined
    }
  }
}

export function useInterval(fn: DisposerFunction, interval: number): DisposerFunction {
  let intervalHandle: any = setInterval(fn, interval)
  return () => {
    if (intervalHandle) {
      clearInterval(intervalHandle)
      intervalHandle = undefined
    }
  }
}

export function useEventListener(
  emitter: any,
  eventName: string,
  fn: (ev?: any) => void,
  ...args: any[]
): DisposerFunction {
  if (emitter == null)
    return () => { }
  if (emitter.on)
    emitter.on(eventName, fn, ...args)
  else if (emitter.addEventListener)
    emitter.addEventListener(eventName, fn, ...args)
  return () => {
    if (emitter.off)
      emitter.off(eventName, fn, ...args)
    else if (emitter.removeEventListener)
      emitter.removeEventListener(eventName, fn, ...args)
  }
}
