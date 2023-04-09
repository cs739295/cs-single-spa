import { GlobalState } from './GlobalState/GlobalState'
import { loadApps } from './application/apps'
import { isInBrowser } from './utils'
import { originalWindow } from './utils/originalEnv'

let isStarted = false

// 首次进入无法监听到路由变化，需要手动加载一次
export default function start() {
    if (!isInBrowser()) {
        throw Error('mini-single-spa must be running in browser!')
    }

    if (!isStarted) {
        originalWindow.spaGlobalState = new GlobalState()
        isStarted = true
        loadApps()
    }
}

export function isStart() {
    return isStarted
}