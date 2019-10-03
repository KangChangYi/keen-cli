const inquirer = require('inquirer')

function buildInCurrent () {
    return inquirer.prompt([{
        name: 'buildInCurrent',
        message: '当前目录为空，且目录名称和项目名称相同，是否直接在当前目录下创建新项目？',
        type: 'confirm',
        default: true
    }])
}

function selectTemplate () {
    return inquirer.prompt([{
        name: 'chooseTemplate',
        message: '请选择模板类型：',
        type: 'list',
        choices: ['Vue', 'React', 'Taro']
    }])
}

module.exports = {
    buildInCurrent,
    selectTemplate
}
