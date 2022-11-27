export const enum ResultCode {
    SUCCESS = 0,
    LOGIN_FAIL = 1,
    SEARCH_ERROR = 2,
    PARAM_ERROR = 3,
    CREATE_EXT_VERSION_FAIL = 1001,
    CREATE_EXT_FAIL_RE_NAME = 1002,
    UPDATE_EXT_DATA_FAIL = 1003,
    CREATE_EXT_VERSION_FAIL_EXT_NOT_EXIST = 1004,
    GET_EXT_FAIL_EXT_NOT_EXIST = 1005,
}

export const codeMap: Record<ResultCode, string> = {
    [ResultCode.SUCCESS]: '成功',
    [ResultCode.LOGIN_FAIL]: '登录失败，您的账号或密码不对',
    [ResultCode.SEARCH_ERROR]: '查询失败',
    [ResultCode.PARAM_ERROR]: '参数错误',
    [ResultCode.CREATE_EXT_VERSION_FAIL]: '创建失败：版本号格式不正确（请参考#.#.#）',
    [ResultCode.CREATE_EXT_FAIL_RE_NAME]: '创建失败：该小程序名称已存在，请换一个名称',
    // [ResultCode.CREATE_EXT_FAIL_RE_NAME]: '该版本未上传资源文件，请先上传资源文件',
    [ResultCode.UPDATE_EXT_DATA_FAIL]: '更新失败：该小程序不存在',
    [ResultCode.CREATE_EXT_VERSION_FAIL_EXT_NOT_EXIST]: '创建版本失败：该小程序不存在',
    [ResultCode.GET_EXT_FAIL_EXT_NOT_EXIST]: '获取失败：该小程序不存在',
};
