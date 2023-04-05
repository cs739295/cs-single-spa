import { AppStatus, Application } from 'src/types'
import { isString } from 'src/utils'
import { appMaps } from 'src/utils/application'

// 处理activeRule
export default function registerApplication(app: Application) {
    if (isString(app.activeRule)) {
        const path = app.activeRule
        app.activeRule = (location = window.location) => location.pathname === path
    }
    app = {
        ...app,
        status: AppStatus.BEFORE_BOOTSTRAP,
        pageBody: '',
        loadedURLs: [],
        scripts: [],
        styles: [],
        isFirstLoad: true,
    }
    appMaps.set(app.name, app)
}