
import { isObject } from "@vue/shared"
import { reactiveHandlers, readonlyHandlers, shallowReactiveHandlers, shallowReadonlyHandlers } from './baseHandlers'

// 柯里化  返回函数 (目标对象) 
export function reactive(target) {
    return creatReactObj(target, false, reactiveHandlers)
}

export function shallowReactive(target) {
    return creatReactObj(target, false, shallowReactiveHandlers)
}

export function readonly(target) {
    return creatReactObj(target, true, readonlyHandlers)
}

export function shallowReadonly(target) {
    return creatReactObj(target, true, shallowReadonlyHandlers)
}


// 实现代理
// 
const reactiveMap = new WeakMap() // key必须是对象 自动垃圾回收
const readOnlyMap = new WeakMap()
function creatReactObj(target, isReadOnly, baseHandlers) {
    // proxy 对象  判断
    if (!isObject(target)) {
        return target
    }
    // 判断目标对象是否被代理
    const proxymap = isReadOnly ? readOnlyMap : reactiveMap
    const proxyEs = proxymap.get(target) //存在代理
    if (proxyEs) {
        return proxyEs
    }
    // 代理
    const proxy = new Proxy(target, baseHandlers)
    proxymap.set(target, proxy) // 存入weakmap
    return proxy
}

