import { http } from "@/utils/http";

export interface IResponse<T> {
  code: number;
  value: T;
  msg: string;
}

/**
 * 注册app参数
 */
export interface IRegistryAppParams {
  /**
   * 应用ID
   */
  extVersionId?: number;
  /**
   * 应用地址
   */
  extMainUrl: string;
  /**
   * 应用名称
   */
  extName: string;
  /**
   * 应用简介
   */
  extBrief?: string;
  /**
   * 应用详细描述
   */
  extDescription: string;
  /**
   * 应用图标
   */
  extLogo?: string;
  /**
   * 应用配置
   */
  extSetting?: string;
  /**
   * 市场快照
   */
  extMarketSnapshots?: string[];
}

/**
 * 
 */
export type IRegistryAppResult = IAppItem

/**
 * 注册 app
 * @param data 
 * @returns 
 */
export const registerApp = (data?: IRegistryAppParams) => {
  return http.request<IRegistryAppResult>("post", "/extOperate/createExt", { data });
};



export interface IAppListParams {
  /**
   * 当前页码
   */
  currentPage?: number;
  /**
   * 每页条数
   */
  pageSize?: number;
}

export interface IAppItem {
  /**
 * 版本ID
 */
  extVersionId?: number;
  /**
   * 小程序ID
   */
  extUuid: number;
  /**
   * 应用地址
   */
  extMainUrl: string;
  /**
   * 应用名称
   */
  extName: string;
  /**
   * 应用简介
   */
  extBrief?: string;
  /**
   * 应用详细描述
   */
  extDescription: string;
  /**
   * 应用图标
   */
  extLogo?: string;
  /**
   * 应用配置
   */
  extSetting?: string;
  /**
   * 市场快照
   */
  extMarketSnapshots?: string;
  /**
   * 关键词
   */
  keyword: string;
  /**
   * 版本
   */
  extVersion: string;
  /**
   * 版本类型
   */
  extVersionType: number;
  /**
   * 版本审核状态
   */
  extVersionAudit: number;
  /**
   * 版本是否已上线
   */
  extVersionOnline: number;
  /**
   * 创建时间
   */
  createTime: string;
  /**
   * 更新时间
   */
  updateTime: string;
}

/**
 * 获取小程序列表
 * @param params 
 * @returns 
 */
export const getAppList = (params?: IAppListParams) => {
  return http.request<IAppItem[]>('get', "/extQuery/listExt", { params });
}