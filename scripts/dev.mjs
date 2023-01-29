
import { execa } from 'execa'
// const execa = require('execa')


async function build(target) {
    console.log(target)
    // 利用execa子进程打包 -c 执行rollup 
    await execa('rollup', ['-cw', '--environment',[`TARGET:${target}`], '--bundleConfigAsCjs', ], { stdio: 'inherit' }) // 自己
}



build('reactivity')