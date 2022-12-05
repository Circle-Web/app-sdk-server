import { upload, region } from 'qiniu-js';
import { http } from "@/utils/http";

export interface IQiniuTokenResult {
  /**
   * 上传凭证
   */
  uploadToken: string;
  /**
   * 上传凭证有效期
   */
  pictureKey: string;
  /**
   * 上传的域名 
   */
  url: string
}

/**
 *  获取七牛云上传凭证
 * @returns 
 */
export const getToken = () => {
  return http.request<IQiniuTokenResult>("get", "/qiniu/token");
}


/**
 * 创建一个七牛云上传对象
 */
export const createQiniuUploader = async (file: File) => {
  const { value } = await getToken();
  const { uploadToken, pictureKey, url } = value;
  return new Promise<string>((resolve, reject) => {
    upload(file, pictureKey, uploadToken, {}, {
      useCdnDomain: true,
      region: region.z2,
    }).subscribe({
      error(err) {
        reject(err)
      },
      complete(res) {
        resolve(`http://${url}/${res.key}`)
      }
    })
  })
}