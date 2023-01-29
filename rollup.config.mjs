// rollup打包

import ts from 'rollup-plugin-typescript2'  //解析ts
import json from '@rollup/plugin-json' // 解析json
import reslovePlugin from '@rollup/plugin-node-resolve' //解析第三方插件
import path from 'path' //处理路径

// 最新 node 核心包的导入写法
import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'
// 获取 __filename 的 ESM 写法
const __filename = fileURLToPath(import.meta.url)
// 获取 __dirname 的 ESM 写法
const __dirname = dirname(fileURLToPath(import.meta.url))


// 获取文件路径
let packagesDir = path.resolve(__dirname,'packages') //获取到路径

// 获取需要打包的包
let packageDir = path.resolve(packagesDir,process.env.TARGET)

let resolve = p =>path.resolve(packageDir,p) // 拿到每个包的配置
const pkg = require(resolve(`package.json`)) // 拿到json
const packageOptions = pkg.buildOptions || {} // 获取 buildOptions
const name = path.basename(packageDir)


// 创建一个output 输入路径 以及设置格式

const outputOptions = {
    "esm-bundler":{
        file:resolve(`dist/${name}.esm-bundler.js`),
        format:'es'
    },
    "cjs":{
        file:resolve(`dist/${name}.cjs.js`),
        format:'cjs'
    },
    "global":{
        file:resolve(`dist/${name}.global.js`),
        format:'iife'
    }
}
// 
const options = packageOptions

function creatConfig(format,output){
    // console.log(output)
    //进行打包
    output.name = options.name
    output.sourcemap = true
    
    //生成rollup配置
    return {
        input:resolve('src/index.ts'), //导入的index.js
        output,
        plugins:[
            json(),
            ts({ //解析ts
                tsconfig:path.resolve(__dirname,'tsconfig.json')
            }),
            reslovePlugin() //三方插件
        ]
    }
}
// rollup 需要导出一个配置
export default options.formats.map(format=>creatConfig(format,outputOptions[format]))