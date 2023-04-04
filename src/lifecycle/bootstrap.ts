import { AnyObject, AppStatus, Application } from 'src/types'
import { isFunction, isObject, isPromise } from 'src/utils'

// 获取props bootstrap mount unmount
export async function bootstrapApp(app: Application) {
    const { bootstrap, mount, unmount } = await app.loadApp()

    validateLifeCycleFunc('bootstrap', bootstrap)
    validateLifeCycleFunc('mount', mount)
    validateLifeCycleFunc('unmount', unmount)

    app.bootsrap = bootstrap
    app.mount = mount
    app.unmount = unmount

    try {
        app.props = await getProps(app.props)
    } catch (err) {
        app.status = AppStatus.BOOTSTRAP_ERROR
        throw err
    }

    let result = (app as any).bootsrap(app.props)

    if (!isPromise(result)) {
        result = Promise.resolve(result)
    }

    return result.then(() => {
        app.status = AppStatus.BOOTSTRAPPED
    }).catch((err: Error) => {
        app.status = AppStatus.BOOTSTRAP_ERROR
        throw err
    })
}

function validateLifeCycleFunc(name: string, fn: any) {
    if (!isFunction(fn)) {
        throw Error(`The "${name}" must be a function`)
    }
}

async function getProps(props: Function | AnyObject) {
    if (typeof props === 'function') return props()
    if (isObject(props)) return props
    return {}
}
