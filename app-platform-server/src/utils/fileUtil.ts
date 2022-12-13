// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require("fs");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

// 递归创建目录 异步方法
export function mkdirs(dirname, callback) {
    fs.exists(dirname, function (exists) {
        if (exists) {
            // 是个目录则执行callback方法
            callback();
        } else {
            // 递归调用mkdirs
            mkdirs(path.dirname(dirname), function () {
                fs.mkdir(dirname, callback);
            });
        }
    });
}
// 递归创建目录 同步方法
export function mkdirsSync(dirname) {
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (mkdirsSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
        }
    }
}
//检测文件或者文件夹存在
export function fsExistsSync(path) {
    try {
        fs.accessSync(path, fs.F_OK);
    } catch (e) {
        return false;
    }
    return true;
}