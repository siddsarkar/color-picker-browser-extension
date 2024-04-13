/**
 * Random UUID generator.
 * @ref: https://stackoverflow.com/a/2117523/11958360
 */
function uuidv4(): string {
  return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, c =>
    (
      (c as any) ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> ((c as any) / 4)))
    ).toString(16)
  )
}

/**
 * Service Locator
 */
abstract class ServiceLocator {
  static get instance(): ServiceLocator {
    return ServiceLocatorImpl.instance
  }

  abstract get<T>(type: new () => T): T
  abstract registerSingleton<T>(type: new () => T, service: T): void
  abstract registerLazySingleton<T>(type: new () => T, factory: () => T): void
  abstract registerFactory<T>(type: new () => T, factory: () => T): void
  abstract unregister<T>(type: new () => T): void
  abstract reset(params?: { dispose: boolean }): void
  abstract resetLazySingleton<T>(type: new () => T): void
}

class ServiceLocatorImpl implements ServiceLocator {
  private constructor() {}

  private static readonly _instance: ServiceLocator = new ServiceLocatorImpl()

  public static get instance(): ServiceLocator {
    return this._instance
  }

  private readonly _debug = true
  private readonly _services = new Map<
    any,
    {
      service?: any
      factory?: () => any
      isLazy?: boolean
    }
  >()

  get<T>(type: new () => T): T {
    const result = this._services.get(type)
    if (result === undefined) {
      throw new Error('Service registration not found!')
    }

    // instance not found, create and return
    if (result?.service === undefined && result?.factory instanceof Function) {
      if (result.isLazy ?? false) {
        this.debugLog('lazy instance not found, creating and returning...')
        const service = result.factory()
        this._services.set(type, { ...result, service })
        return service
      }

      this.debugLog('returning new instance...')
      const service = result.factory()
      return service
    }

    this.debugLog('returning already created instance...')
    return result?.service
  }

  registerSingleton<T>(type: new () => T, service: T): void {
    this._services.set(type, { service })
  }

  registerLazySingleton<T>(type: new () => T, factory: () => T): void {
    this._services.set(type, { factory, isLazy: true })
  }

  registerFactory<T>(type: new () => T, factory: () => T): void {
    this._services.set(type, { factory })
  }

  unregister<T>(type: new () => T): void {
    // if the service is already instantiated, dispose it
    const result = this._services.get(type)
    if (result?.service.dispose instanceof Function) {
      result.service.dispose()
    }

    this._services.delete(type)
  }

  reset(params = { dispose: true }): void {
    this.debugLog('clearing service registrations...')

    if (params.dispose) {
      this.debugLog('disposing services...')
      this._services.forEach((value, key) => {
        if (value.service instanceof Function) {
          return
        }

        if (value.service.dispose instanceof Function) {
          value.service.dispose()
        }
      })
    }

    this._services.clear()
  }

  resetLazySingleton<T>(type: new () => T): void {
    this.debugLog('trying to reset lazy singleton...')

    const result = this._services.get(type)
    if (result === undefined) {
      throw new Error('Service registration not found!')
    }

    if (result?.isLazy ?? false) {
      // if the service is function, it is not instantiated yet
      // so, no need to reset
      if (result?.service instanceof Function) {
        console.log('lazy service not instantiated yet, skipping...')
        return
      }

      // if the service is already instantiated, dispose it
      if (result?.service.dispose instanceof Function) {
        console.log('calling dispose on service...')
        result.service.dispose()
      }

      // then reset the service, and make it lazy again
      this._services.set(type, {
        ...result,
        service: undefined
      })
      console.log('lazy singleton reset successfully!')
    } else {
      console.log('service is not a lazy one, skipping...')
    }
  }

  private debugLog(message: string): void {
    if (!this._debug) return

    console.log(message)
  }
}

// Usage

const sl = ServiceLocator.instance

class Logger {
  private readonly instanceId
  private readonly timerId

  constructor() {
    this.instanceId = uuidv4()
    console.log('Logger constructor called!')
    this.timerId = setInterval(() => {
      console.log('service running...', this.instanceId)
    }, 1000)
  }

  log(message: string): void {
    console.log(message, this.instanceId)
  }

  dispose(): void {
    clearInterval(this.timerId)
    console.log('Logger disposed!')
  }
}

console.log('execution started!')

sl.registerSingleton<Logger>(Logger, new Logger())
// sl.registerLazySingleton<Logger>(Logger, () => new Logger())
// sl.registerFactory<Logger>(Logger, () => new Logger())

const l1 = sl.get<Logger>(Logger)
setTimeout(() => {
  sl.unregister<Logger>(Logger)
  // somewhere later in your code
  l1.log('l1 log')

  // again somewhere later in your code
  const l2 = sl.get<Logger>(Logger)
  l2.log('l2 log')
}, 1000)

setTimeout(() => {
  sl.resetLazySingleton<Logger>(Logger)

  const l3 = sl.get<Logger>(Logger)
  l3.log('l3 log')
}, 5000)

setTimeout(() => {
  sl.reset()
}, 10000)
