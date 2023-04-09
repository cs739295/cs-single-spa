import { originalDocument, originalWindow } from './originalEnv'

export function isString(value: any) {
    return typeof value === 'string'
}

export function isFunction(value: any) {
    return typeof value === 'function'
}

export function isObject(value: any) {
    return Object.prototype.toString.call(value) === '[object Object]'
}

export function isPromise(p: any) {
    return p && Object.prototype.toString.call(p) === '[object Promise]'
}

export function nextTick(callback: () => void) {
    Promise.resolve().then(callback)
}

export function isInBrowser() {
    return typeof originalWindow === 'object' && typeof originalDocument === 'object'
}