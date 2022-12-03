export const enum ResultCode {
  SUCCESS = 0,
  LOGIN_FAIL = 1,
  SEARCH_ERROR = 2,
  PARAM_ERROR = 3,
  REGIESTER_FAIL = 100,

  IM_REQUEST_FAIL = 300,
  IM_INSTALL_EXT_ROLE_FAIL = 301,
  IM_UNINSTALL_EXT_ROLE_FAIL = 302,
  IM_EXT_INSTALLED = 303,
  IM_EXT_UNINSTALLED = 304,

  CREATE_EXT_VERSION_FAIL = 1001,
  CREATE_EXT_FAIL_RE_NAME = 1002,
  UPDATE_EXT_DATA_FAIL = 1003,
  CREATE_EXT_VERSION_FAIL_EXT_NOT_EXIST = 1004,
  GET_EXT_FAIL_EXT_NOT_EXIST = 1005,
  UPDATE_EXT_VERSION_AUDIT_FAIL = 1006,
  UPDATE_EXT_DATA_FAIL_VERSION_TYPE_ERROR = 1007,
  UPDATE_EXT_DATA_FAIL_VERSION_TYPE_BACK_DEV_ERROR = 1008,
  UPDATE_EXT_DATA_FAIL_VERSION_TYPE_AUDIT_ERROR = 1009,
  UPDATE_EXT_DATA_FAIL_VERSION_TYPE_BACK_TEST_ERROR = 1010,

  SIGN_EXT_SIGN_FAIL = 5000,
}

export const codeMap: Record<ResultCode, string> = {
    [ResultCode.SUCCESS]: '成功',
    [ResultCode.LOGIN_FAIL]: '登录失败，您的账号或密码不对',
    [ResultCode.SEARCH_ERROR]: '查询失败',
    [ResultCode.PARAM_ERROR]: '参数错误',
    [ResultCode.REGIESTER_FAIL]: '注册失败：该账号已存在',
    [ResultCode.IM_REQUEST_FAIL]: '请求失败',
    [ResultCode.IM_INSTALL_EXT_ROLE_FAIL]: '安装失败：仅社区管理员可以安装',
    [ResultCode.IM_UNINSTALL_EXT_ROLE_FAIL]: '移除失败：仅社区管理员可以移除',
    [ResultCode.IM_EXT_INSTALLED]: '安装失败：该插件已安装',
    [ResultCode.IM_EXT_UNINSTALLED]: '移除失败：该插件已移除',
    [ResultCode.CREATE_EXT_VERSION_FAIL]: '创建失败：版本号格式不正确（请参考#.#.#）',
    [ResultCode.CREATE_EXT_FAIL_RE_NAME]: '创建失败：该小程序名称已存在，请换一个名称',
    // [ResultCode.CREATE_EXT_FAIL_RE_NAME]: '该版本未上传资源文件，请先上传资源文件',
    [ResultCode.UPDATE_EXT_DATA_FAIL]: '更新失败：该小程序不存在',
    [ResultCode.CREATE_EXT_VERSION_FAIL_EXT_NOT_EXIST]: '创建版本失败：该小程序不存在',
    [ResultCode.GET_EXT_FAIL_EXT_NOT_EXIST]: '获取失败：该小程序不存在',
    [ResultCode.UPDATE_EXT_VERSION_AUDIT_FAIL]: '提交失败：概要/描述/屏幕快照信息不能为空，请先设置',
    [ResultCode.UPDATE_EXT_DATA_FAIL_VERSION_TYPE_ERROR]: '提交失败：当前不是开发版本，无法提交测试',
    [ResultCode.UPDATE_EXT_DATA_FAIL_VERSION_TYPE_BACK_DEV_ERROR]: '回退失败：当前不是测试版本，无法回退修改',
    [ResultCode.UPDATE_EXT_DATA_FAIL_VERSION_TYPE_AUDIT_ERROR]: '提交失败：当前不是测试版本，无法提交审核',
    [ResultCode.UPDATE_EXT_DATA_FAIL_VERSION_TYPE_BACK_TEST_ERROR]: '回退失败：当前不是审核版本，无法回退测试',

    [ResultCode.SIGN_EXT_SIGN_FAIL]: '签到失败：今天已签到！',
};
