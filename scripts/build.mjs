// const fs = require('fs')
import fs from 'fs'
import { execa } from 'execa'
// const execa = require('execa')
const dir = fs.readdirSync('packages').filter(p => {
    if (!fs.statSync(`packages/${p}`).isDirectory()) {
        return false
    }
    return true
})

async function build(target) {
    console.log(target)
    // 利用execa子进程打包 -c 执行rollup 
    await execa('rollup', ['-c', '--environment',[`TARGET:${target}`], '--bundleConfigAsCjs', ], { stdio: 'inherit' }) // 自己
}

async function runParaller(dir, itemFn) {
    let result = []
    //遍历
    for (let item of dir) {
        result.push(itemFn(item))
    }
    return Promise.all(result)
}
//2 并行打包
runParaller(dir, build).then(() => {
    console.log('success')
})

console.log(dir)