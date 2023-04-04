import { AppStatus, Application } from 'src/types'
import { isPromise } from 'src/utils'

// 调用mount
export function mountApp(app: Application) {
    app.status = AppStatus.BEFORE_MOUNT

    let result = (app as any).mount(app.props)

    if (!isPromise(result)) {
        result = Promise.resolve(result)
    }

    return result
    .then(() => {
        app.status = AppStatus.MOUNTED
    })
    .catch((err: Error) => {
        app.status = AppStatus.MOUNT_ERROR
        throw err
    })
}