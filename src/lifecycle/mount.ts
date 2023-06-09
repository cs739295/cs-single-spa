import { addStyles } from '../utils/dom'
import { Application, AppStatus } from '../types'
import { triggerAppHook } from '../utils/application'

export function mountApp(app: Application): Promise<any> {
    triggerAppHook(app, 'beforeMount', AppStatus.BEFORE_MOUNT)

    if (!app.isFirstLoad) {
        // 重新加载子应用时恢复快照
        app.sandbox.restoreWindowSnapshot()
        app.sandbox.start()
        app.container.innerHTML = app.pageBody
        addStyles(app.styles)
    } else {
        app.isFirstLoad = false
    }

    const result = (app as any).mount({ props: app.props, container: app.container })

    return Promise.resolve(result)
    .then(() => {
        triggerAppHook(app, 'mounted', AppStatus.MOUNTED)
    })
    .catch((err: Error) => {
        app.status = AppStatus.MOUNT_ERROR
        throw err
    })
}