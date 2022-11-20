export const enum ResultCode {
    SUCCESS = 0,
    LOGIN_FAIL = 1,
}

export const codeMap: Record<ResultCode, string> = {
    [ResultCode.SUCCESS]: '成功',
    [ResultCode.LOGIN_FAIL]: '登录失败，您的账号或密码不对',
};
