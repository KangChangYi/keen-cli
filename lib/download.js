const download = require('download-git-repo')
const path = require('path')

module.exports = function (target, templateAddress) {
    target = path.join(target || '.')
    return new Promise(function (resolve, reject) {
        download(templateAddress, target, (err) => {
            // 下载的模板存放在一个临时路径中，下载完成后，可以向下通知这个临时路径，以便后续处理
            if (err) {
                reject(err)
            } else {
                resolve(target)
            }
        })
    })
}
