#!/usr/bin/env node
const program = require('commander')
const path = require('path')
const fs = require('fs')
const glob = require('glob')
const ora = require('ora')
const download = require('../lib/download')
const prompt = require('../lib/prompt')

program.name('keen create')
    .usage('<project-name>')
    .helpOption('-h, --help', '显示帮助')
    .parse(process.argv)

let projectName = program.args[0] // 获取项目名称

if (!projectName) { // 未输入名称则显示帮助信息
    program.help()
}

const dirList = glob.sync('*')   // 当前目录
let rootDirName = path.basename(process.cwd())   // 当前根目录

let next = null

if (dirList.length !== 0) {  // 如果当前目录不为空
    if (!judgeDirListHasSameName(dirList)) {
        return
    }
    next = Promise.resolve(projectName)
} else if (rootDirName === projectName) { // 如果和父文件夹名称相同
    next = prompt.buildInCurrent().then(answer => {
        return Promise.resolve(answer.buildInCurrent ? '.' : projectName)
    })
} else {
    next = Promise.resolve(projectName)
}

next && go()

const templateRepo = {
    Vue: 'KangChangYi/Vue2.0-project-template#master',
    taro: '',
    React: ''
}

let spinner = null

function go () {
    next.then(async projectRoot => {
        // 选择模板类型
        let templateAddress = await prompt.selectTemplate().then(answer => {
            // 获取模板地址
            return templateRepo[answer.chooseTemplate]
        })
        if (!templateAddress) {
            console.log('抱歉，该类型模板尚未支持下载，请选择其他模板类型')
            return
        }

        if (projectRoot !== '.') {
            fs.mkdirSync(projectRoot)
        }
        // 提示
        spinnerStart()
        // 下载
        let downloadResult = await download(projectRoot, templateAddress).then(target => {
            if (typeof target === 'string') {
                spinnerChange('下载完成')
                return true
            } else {
                spinnerChange('下载失败')
                return true
            } 
        })
        if(downloadResult) { return }
        // TODO ...
    })
}

function spinnerStart () {
    spinner = ora('模板下载中...').start()
    spinner.color = 'yellow'
    setTimeout(() => {
        spinner.text = '客官请耐心等待...'
    }, 4500)
}

function spinnerChange (text) {
    if (text === '下载完成') {
        spinner.succeed(text)
    } else {
        spinner.fail(text)
    }
    spinner.stop()
}

// 判断当前目录下是否存在同名文件夹
function judgeDirListHasSameName (dirList) {
    const hasSameDir = dirList.filter(dirName => {
        const fileName = path.resolve(process.cwd(), dirName)
        const isDir = fs.statSync(fileName).isDirectory()
        return dirName.indexOf(projectName) !== -1 && isDir
    })
    if (hasSameDir.length !== 0) {
        console.log(`注意：项目 '${projectName}' 已经存在！`)
        return false
    }
    return true
}

// if (dirList.length) {  // 如果当前目录不为空
//     if (dirList.filter(dirName => {
//         const fileName = path.resolve(process.cwd(), dirName)
//         const isDir = fs.statSync(fileName).isDirectory()
//         return dirName.indexOf(projectName) !== -1 && isDir
//     }).length !== 0) {
//         console.log(`注意：项目 '${projectName}' 已经存在！`)
//         return
//     }
//     next = Promise.resolve({ projectName })
// } else if (rootDirName === projectName) {
//     next = prompt.buildInCurrent().then(answer => {
//         return Promise.resolve({ projectName: answer.buildInCurrent ? '.' : projectName })
//     })
//     // next = inquirer.prompt([{
//     //     name: 'buildInCurrent',
//     //     message: '当前目录为空，且目录名称和项目名称相同，是否直接在当前目录下创建新项目？',
//     //     type: 'confirm',
//     //     default: true
//     // }]).then(answer => {
//     //     return Promise.resolve({ projectName: answer.buildInCurrent ? '.' : projectName })
//     // })
// } else {
//     // next = Promise.resolve(projectName)
//     next = inquirer.prompt([{
//         name: 'chooseTemplate',
//         message: '请选择模板类型：',
//         type: 'list',
//         choices: ['Vue', 'React', 'Taro'],
//     }]).then(answer => {
//         chooseTemplate = answer.chooseTemplate
//         return Promise.resolve(answer.chooseTemplate ? '.' : projectName)
//     })
// }

// next && go()

// function go () {
//     next.then(projectRoot => {
//         if (projectRoot !== '.') {
//             fs.mkdirSync(projectRoot)
//         }
//         return download(projectRoot)
//             .then(target => {
//                 console.log(target)
//                 return {
//                     projectRoot,
//                     downloadTemp: '456'
//                 }
//             })
//     })
// }