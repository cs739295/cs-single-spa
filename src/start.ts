import { loadApps } from './application/apps'

let isStarted = false

// 首次进入无法监听到路由变化，需要手动加载一次
export default function start() {
    if (!isStarted) {
        isStarted = true
        try {
            loadApps()
        } catch (error) {
            throw error
        }
    }
}

export function isStart() {
    return isStarted
}