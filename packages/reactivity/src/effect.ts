


export function effect(fn, options: any = {}) {
    const effect = creatReactEffect(fn, options)
    if (!options.lazy) {
        effect() // 默认执行
    }

    return effect
}

let uid = 0
let activeEffect // 保存当前effect
const effectStack = []
function creatReactEffect(fn, options) {
    const effect = function reactiveEffect() {
        if (!effectStack.includes(effect)) { // 保证effect没有加入栈
            try {
                effectStack.push(effect)
                activeEffect = effect
                fn() //执行用户方法
            } finally {
                effectStack.pop()
                activeEffect = effectStack[effectStack.length - 1]
            }
        }

    }
    effect.id = uid++ //自增区别
    effect._isEffect = true //响应式
    effect.raw = fn // 保存 用户方法
    effect.options = options // 保存options
    return effect
}

let targetMap = new WeakMap()
export function Track(target, type, key) {
    console.log(target, type, key, activeEffect)

    if(activeEffect===undefined){ // 没有effect
        return
    }
    // 获取effect
    let depMap = targetMap.get(target)
    // 没有
    if(!depMap){
        targetMap.set(target,depMap = new Map())
    }
    // 有
    let dep = depMap.get(key)
    if(!dep){ // 没有属性
        depMap.set(key,(dep=new Set))
    }
    if(!dep.has(activeEffect)){
        dep.add(activeEffect)
    }
    console.log(targetMap)
}