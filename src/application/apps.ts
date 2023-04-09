import { bootstrapApp } from 'src/lifecycle/bootstrap'
import { mountApp } from 'src/lifecycle/mount'
import { unMountApp } from 'src/lifecycle/unmount'
import { AppStatus, Application } from 'src/types'
import { appMaps } from 'src/utils/application'

export async function loadApps() {
    const toUnMountApp = getAppsWithStatus(AppStatus.MOUNTED)
    await Promise.all(toUnMountApp.map(unMountApp))

    const toLoadApp = getAppsWithStatus(AppStatus.BEFORE_BOOTSTRAP)
    await Promise.all(toLoadApp.map(bootstrapApp))

    const toMountApp = [
        ...getAppsWithStatus(AppStatus.UNMOUNTED),
        ...getAppsWithStatus(AppStatus.BOOTSTRAPPED),
    ]

    await toMountApp.map(mountApp)
}

function getAppsWithStatus(status: AppStatus) {
    const result: Application[] = []

    appMaps.forEach(app => {
        // tobootstrap or tomount
        if (isActive(app) && app.status === status) {
            switch (app.status) {
                case AppStatus.BEFORE_BOOTSTRAP:
                case AppStatus.BOOTSTRAPPED:
                case AppStatus.UNMOUNTED:
                    result.push(app)
                    break
            }
        } else if (app.status === AppStatus.MOUNTED && status === AppStatus.MOUNTED) {
            // tounmount
            result.push(app)
        }
    })

    return result
}

function isActive(app: Application) {
    return typeof app.activeRule === 'function' && app.activeRule(window.location)
}
