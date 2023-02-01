import { isObject } from "@vue/shared"
import { TrackOpTypes } from "./operations"
import { reactive, readonly } from "./reactive"
import { Track } from "./effect"

function createGetter(isReadOnly=false,shallow=false) {
    return function get(target,key,receiver){
        // proxy + reflect  
        const res = Reflect.get(target,key,receiver)

        if(!isReadOnly){
           // 收集依赖
           Track(target,TrackOpTypes.GET,key) // 执行依赖收集
        }
        if(shallow){ //{name:'sss',list:{}}
            return res
        }
        // key是一个对象 懒代理 递归
        if(isObject(res)){
            return isReadOnly ? readonly(res) : reactive(res)
        }
        return res
    }
}

// get 
const get = /*#__PURE__*/ createGetter()
const shallowGet = /*#__PURE__*/ createGetter(false, true)
const readonlyGet = /*#__PURE__*/ createGetter(true)
const shallowReadonlyGet = /*#__PURE__*/ createGetter(true, true)

// set
const set = /*#__PURE__*/ createSetter()
const shallowSet = /*#__PURE__*/ createSetter(true)

function createSetter(shallow=false){
    return function set(target,key,value,recevicer){
        const res =Reflect.set(target,key,value,recevicer)
        //触发
        return res
    }
}

export const reactiveHandlers = {
    get,
    set
}

export const shallowReactiveHandlers = {
    get: shallowGet,
    set: shallowSet
}
export const readonlyHandlers = {
    get: readonlyGet,
    set:(target,key,value)=>{
        console.log(`set on key is fail`)
    }
}
export const shallowReadonlyHandlers = {
    get: shallowReadonlyGet,
    set:(target,key,value)=>{
        console.log(`set on key is fail`)
    }
}

