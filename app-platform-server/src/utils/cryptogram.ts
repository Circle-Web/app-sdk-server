// eslint-disable-next-line @typescript-eslint/no-var-requires
const CryptoJS = require('crypto-js')

const KEY = 'cyktqnqweqwe'
const iv = '1234567890'
// 加密
export function encrypt(text: string, key = KEY) {
    // function encrypt(text, key = KEY) {
    return CryptoJS.AES.encrypt(text, CryptoJS.enc.Utf8.parse(key), {
        iv: CryptoJS.enc.Utf8.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    }).toString()
}

// 解密
export function decrypt(text: string, key = KEY) {
    // function decrypt(text, key = KEY) {
    const decrypted = CryptoJS.AES.decrypt(text, CryptoJS.enc.Utf8.parse(key), {
        iv: CryptoJS.enc.Utf8.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    })
    return decrypted.toString(CryptoJS.enc.Utf8)
}
// const e = encrypt('tqn_1670343243375')
// console.log(e)
// console.log(decrypt(e))