export interface ResultCodePair {
    readonly code: number
    readonly msg: string
}

export const ResultCode = {
    "SUCCESS": [0, "成功"],
    "LOGIN_FAIL": [1, "登录失败，您的账号或密码不对"],
}
