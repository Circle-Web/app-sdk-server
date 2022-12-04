import { http } from "@/utils/http";

export type UserResult = {
  /** 用户名 */
  username: string;
  /** 当前登陆用户的角色 */
  roleId: number;
  /** `token` */
  token: string;
};

export type RefreshTokenResult = {
  code: number;
  value: {
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: Date;
  };
  msg: string;
};

/** 登录 */
export const getLogin = (data?: object) => {
  return http.request<UserResult>("post", "/user/login", { data });
};

/** 刷新token */
export const refreshTokenApi = (data?: object) => {
  return http.request<RefreshTokenResult>("post", "/refreshToken", { data });
};

export const register = (data?: object) => {
  return http.request<UserResult>("post", "/user/register", { data });
};
