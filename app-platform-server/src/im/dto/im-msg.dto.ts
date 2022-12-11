export class ImMsg {
    from: string
    to: string[] // 发送的目标；注意这里需要用数组，数组内添加的最大用户数默认600个，即使只有一个用户，也要用数组 ['u1']；给用户发送时数组元素是用户名，给群组发送时，数组元素是groupid
    type: string
    body: {
        msg: string
    }
    customEvent: string
    customExts?: Map<string, string>
    ext?: string
}