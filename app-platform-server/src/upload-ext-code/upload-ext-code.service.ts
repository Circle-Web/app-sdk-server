import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExtQueryService } from 'src/app-store/ext-query/ext-query.service';
import { md5 } from 'src/utils/cryptogram';
import { mkdirsSync } from 'src/utils/fileUtil';
import { ResultCode } from 'src/utils/result/resultCode';
import { ResultFactory } from 'src/utils/result/resultFactory';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require("fs")

@Injectable()
export class UploadExtCodeService {
  public static EXT_RESOURCE_PATH_ROOT = "app.extResourcePathRoot"
  constructor(
    private readonly configService: ConfigService,
    private readonly extQueryService: ExtQueryService,
  ) { }

  async upload(extAuthorId: number, file: { path: any; mimetype: string; filename: any; }, body: { extVersionId: number; }) {
    console.log('file', file);
    const versionDetailRes = await this.extQueryService.findVersonDetail(extAuthorId, body.extVersionId)
    if (versionDetailRes.error()) {
      return versionDetailRes
    }
    const version = versionDetailRes.getValue()
    const buffer = fs.readFileSync(file.path)
    const fileMd5 = md5(buffer)

    let extResourceUrl = version.extResourceUrl
    let filePath = `${this.configService.get(UploadExtCodeService.EXT_RESOURCE_PATH_ROOT)}/${extResourceUrl}`
    if (version.extResourceMd5 !== fileMd5) {
      extResourceUrl = `${version.extUuid}/source/${version.extVersion}/${fileMd5}`
      filePath = `${this.configService.get(UploadExtCodeService.EXT_RESOURCE_PATH_ROOT)}/${extResourceUrl}`
      const res = mkdirsSync(filePath)
      if (res) {
        const extname = file.mimetype?.split('/')?.[1] ?? "zip";
        const fileName = md5(file.filename).substring(0, 11)
        const newFileName = `${fileName}.${extname}`
        filePath = `${filePath}/${newFileName}`
        fs.writeFile(filePath, buffer, (err: any) => {
          if (err) {
            return Logger.warn("上传ext代码包写入失败", err)
          }
          version.extResourceMd5 = fileMd5
          version.extResourceUrl = `${extResourceUrl}/${newFileName}`
          this.extQueryService.update(version)
        })
      } else {
        Logger.warn(`${filePath} 路径递归创建失败`)
        return ResultFactory.create(ResultCode.SEARCH_ERROR)
      }
    }
    return ResultFactory.success({
      fileMd5,
      filePath,
    });
  }

}
