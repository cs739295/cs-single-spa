import { AppStatus, Application } from 'src/types'
import { isString } from 'src/utils'
import { apps } from './apps'

// 处理activeRule
export default function registerApplication(app: Application) {
    if (isString(app.activeRule)) {
        const path = app.activeRule
        app.activeRule = (location = window.location) => location.pathname === path
    }
    app.status = AppStatus.BEFORE_BOOTSTRAP
    apps.push(app)
}