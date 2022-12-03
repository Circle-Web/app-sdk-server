export default class IMUser {
    user_Id: string
    role: number = 1
    access_token: string
    application: string  //当前 App 的 UUID 值
    expires_in: number = 0
    createTime: number = 0
}