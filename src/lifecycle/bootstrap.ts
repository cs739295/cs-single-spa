import { Sandbox } from 'src/sandbox/Sandbox'
import { AnyObject, AppStatus, Application } from 'src/types'
import { isFunction, isObject } from 'src/utils'
import { triggerAppHook } from 'src/utils/application'
import { addStyles } from 'src/utils/dom'
import { executeScripts, parseHTMLandloadSources } from 'src/utils/source'

// 获取props bootstrap mount unmount
export async function bootstrapApp(app: Application) {
    // 触发生命周期函数
    triggerAppHook(app, 'beforeBootstrap', AppStatus.BEFORE_BOOTSTRAP)
    try {
        // 核心
        await parseHTMLandloadSources(app)
    } catch (error) {
        throw error
    }

    // 核心：代理window对象 & 重写window某些属性进行劫持 & 快照
    app.sandbox = new Sandbox(app)
    app.sandbox.start()
    app.container.innerHTML = app.pageBody

    // 执行子应用入口页面的 style script 标签
    addStyles(app.styles)

    // 核心：设置子应用window作用域 & 同时会动态插入一些标签。
    // 因此sandbox 要在执行scripts标签前实例化
    executeScripts(app.scripts, app)

    const { mount, unmount } = await getLifeCycleFuncs(app)

    validateLifeCycleFunc('mount', mount)
    validateLifeCycleFunc('unmount', unmount)

    app.mount = mount
    app.unmount = unmount

    try {
        app.props = await getProps(app.props)
    } catch (err) {
        app.status = AppStatus.BOOTSTRAP_ERROR
        throw err
    }

    // 子应用首次加载的脚本执行完就不再需要了
    app.scripts.length = 0
    // 记录首次加载时 window 快照，重新挂载子应用时恢复
    app.sandbox.recordWindowSnapshot()

    triggerAppHook(app, 'bootstrapped', AppStatus.BOOTSTRAPPED)
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

function getLifeCycleFuncs(app: Application) {
    const result = app.sandbox.proxyWindow.__SINGLE_SPA__
    if (isFunction(result)) {
        return result()
    }

    if (isObject(result)) {
        return result
    }

    // eslint-disable-next-line no-restricted-globals
    throw Error('The micro app must inject the lifecycle("bootstrap" "mount" "unmount") into window.__SINGLE_SPA__')
}
