import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadExtCodeService } from 'src/upload-ext-code/upload-ext-code.service';
import { mkdirsSync } from 'src/utils/fileUtil';
import { Result } from 'src/utils/result/result';
import { ResultCode } from 'src/utils/result/resultCode';
import { ResultFactory } from 'src/utils/result/resultFactory';
import { Repository } from 'typeorm';
import { ExtStatus } from '../data/extStatus';
import { ExtVersionAudit } from '../data/extVersionAudit';
import { ExtVersionBuild } from '../data/extVersionBuild';
import { ExtVersionOnline } from '../data/extVersionOnline';
import { ExtVersionType } from '../data/extVersionType';
import { UpdateExtDto } from '../dto/update-ext.dto';
import { ExtMainDetailDO } from '../entities/ext-main-detail.entity';
import { ExtVersionDO } from '../entities/ext-version.entity';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const compressing = require('compressing');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

@Injectable()
export class ExtOperateService {

    private static EXT_VERSION = '0.0.0'
    constructor(
        private readonly configService: ConfigService,
        @InjectRepository(ExtMainDetailDO)
        private readonly rep: Repository<ExtMainDetailDO>,
        @InjectRepository(ExtVersionDO)
        private readonly versionRep: Repository<ExtVersionDO>,
    ) { }

    async createExt(extAuthorId: number, dto: UpdateExtDto) {
        const { extName } = dto
        const v = await this.rep.findOne({ where: { extName } });
        if (v) {
            return ResultFactory.create(ResultCode.CREATE_EXT_FAIL_RE_NAME);
        }
        const extVersion = ExtOperateService.EXT_VERSION;
        const _do = this.rep.create({ extName, extAuthorId, extLogo: dto.extLogo })
        const { extUuid } = await this.rep.save(_do);

        const createRes = await this.createVersion(extAuthorId, extUuid, extVersion)
        if (createRes.error()) {
            return createRes
        }
        dto.extVersionId = createRes.getValue().extVersionId
        return this.updateVersion(extAuthorId, dto)
    }

    async reOnlineExt(extAuthorId: number, extUuid: number) {
        const extMainDetail = await this.rep.findOne({ where: { extUuid, extAuthorId } })
        if (!extMainDetail) {
            return ResultFactory.create(ResultCode.UPDATE_EXT_DATA_FAIL)
        }
        extMainDetail.extStatus = ExtStatus.ONLINE
        await this.rep.save(extMainDetail)
        return ResultFactory.success()
    }

    async offlineExt(extAuthorId: number, extUuid: number) {
        const extMainDetail = await this.rep.findOne({ where: { extUuid, extAuthorId } })
        if (!extMainDetail) {
            return ResultFactory.create(ResultCode.UPDATE_EXT_DATA_FAIL)
        }
        extMainDetail.extStatus = ExtStatus.OFFLINE
        await this.rep.save(extMainDetail)
        return ResultFactory.success()
    }

    async createVersion(extAuthorId: number, extUuid: number, version: string): Promise<Result<any>> {
        if (!this.validateVersionFormat(version)) {
            return ResultFactory.create(ResultCode.CREATE_EXT_VERSION_FAIL)
        }
        const extMainDetailDO = await this.rep.findOne({ where: { extUuid, extAuthorId } })
        if (!extMainDetailDO) {
            return ResultFactory.create(ResultCode.CREATE_EXT_VERSION_FAIL_EXT_NOT_EXIST)
        }
        const _do = this.versionRep.create({ extUuid, extName: extMainDetailDO.extName, extLogo: extMainDetailDO.extLogo, extVersion: version })
        const { extVersionId, extName, extLogo, extMainUrl, extBrief, extDescription, extMarketSnapshots,
            keywords, extVersion, createTime, updateTime } = await this.versionRep.save(_do)

        return ResultFactory.success({
            extVersionId, extName, extLogo, extMainUrl, extBrief, extDescription, extMarketSnapshots: extMarketSnapshots?.split("#") ?? [],
            keywords: keywords?.split("#") ?? [], extVersion, createTime, updateTime
        })
    }

    validateVersionFormat(version: string) {
        const arr = version.split('.')
        if (arr.length != 3) {
            return false
        }
        for (let index = 0; index < arr.length; index++) {
            const element = arr[index];
            const n = Number(element);
            if (isNaN(n)) {
                return false
            }
        }
        return true
    }

    async updateVersion(extAuthorId: number, dto: UpdateExtDto) {
        const extVersionId = dto.extVersionId
        const version = await this.versionRep.findOne({ where: { extVersionId } })
        if (!version) {
            return ResultFactory.create(ResultCode.UPDATE_EXT_DATA_FAIL)
        }
        if (version.extVersionType != ExtVersionType.DEV) {
            return ResultFactory.create(ResultCode.UPDATE_EXT_DATA_FAIL_VERSION_IS_NOT_DEV)
        }
        const extMainDetail = await this.rep.findOne({ where: { extUuid: version.extUuid, extAuthorId } })
        if (!extMainDetail) {
            return ResultFactory.create(ResultCode.UPDATE_EXT_DATA_FAIL)
        }
        version.extMainUrl = dto.extMainUrl ?? ""
        version.extBrief = dto.extBrief ?? ""
        version.extDescription = dto.extDescription ?? ""
        version.extLogo = dto.extLogo
        version.extMarketSnapshots = dto.extMarketSnapshots?.join("#") ?? ""
        version.extName = dto.extName
        await this.versionRep.save(version)
        return ResultFactory.success({ version })
    }

    async versionCommitTest(extAuthorId: number, extVersionId: number) {
        const versionDO = await this.versionRep.findOne({ where: { extVersionId } })
        if (!versionDO) {
            return ResultFactory.create(ResultCode.UPDATE_EXT_DATA_FAIL)
        }
        const extUuid = versionDO.extUuid
        const extMainDetail = await this.rep.findOne({ where: { extUuid, extAuthorId } })
        if (!extMainDetail) {
            return ResultFactory.create(ResultCode.UPDATE_EXT_DATA_FAIL)
        }
        if (versionDO.extVersionType != ExtVersionType.DEV) {
            return ResultFactory.create(ResultCode.UPDATE_EXT_DATA_FAIL_VERSION_TYPE_ERROR)
        }
        if (!versionDO.extResourceUrl) {
            return ResultFactory.create(ResultCode.UPDATE_EXT_DATA_FAIL_NOT_EXIST_RESOURCE_URL)
        }
        versionDO.extVersionType = ExtVersionType.TEST
        const resourcePath = `${this.configService.get(UploadExtCodeService.EXT_RESOURCE_PATH_ROOT)}/${versionDO.extResourceUrl}`
        const time = +new Date
        const newPath = `${path.join(__dirname, '../../../', 'static')}/${extUuid}/${time}`
        Logger.debug({ newPath })
        mkdirsSync(newPath)
        const res = await this.unzip(resourcePath, newPath)
        if (res) {
            versionDO.extVersionBuild = ExtVersionBuild.BUILD_SUCCESS
            versionDO.extTestUrl = `${this.configService.get("app.ip")}/${this.configService.get("app.port")}/${extUuid}/${time}/dist/index.html`
        }
        await this.versionRep.save(versionDO)
        return ResultFactory.success()
    }
    //解压缩
    unzip(path: string, fllepath: string) {
        return new Promise((resolve, reject) => {
            compressing.zip.uncompress(path, fllepath, { zipFileNameEncoding: 'GBK' })
                .then(() => {
                    resolve(true);
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
    async versionTestBack(extAuthorId: number, extVersionId: number) {
        const versionDO = await this.versionRep.findOne({ where: { extVersionId } })
        if (!versionDO) {
            return ResultFactory.create(ResultCode.UPDATE_EXT_DATA_FAIL)
        }
        const extMainDetail = await this.rep.findOne({ where: { extUuid: versionDO.extUuid, extAuthorId } })
        if (!extMainDetail) {
            return ResultFactory.create(ResultCode.UPDATE_EXT_DATA_FAIL)
        }
        if (versionDO.extVersionType != ExtVersionType.TEST) {
            return ResultFactory.create(ResultCode.UPDATE_EXT_DATA_FAIL_VERSION_TYPE_BACK_DEV_ERROR)
        }
        versionDO.extVersionType = ExtVersionType.DEV
        versionDO.extVersionBuild = ExtVersionBuild.NOT_BUILD
        await this.versionRep.save(versionDO)
        return ResultFactory.success()
    }

    async versionCommitJudge(extAuthorId: number, extVersionId: number) {
        const versionDO = await this.versionRep.findOne({ where: { extVersionId } })
        if (!versionDO) {
            return ResultFactory.create(ResultCode.UPDATE_EXT_DATA_FAIL)
        }
        const extMainDetail = await this.rep.findOne({ where: { extUuid: versionDO.extUuid, extAuthorId } })
        if (!extMainDetail) {
            return ResultFactory.create(ResultCode.UPDATE_EXT_DATA_FAIL)
        }
        if (versionDO.extVersionType != ExtVersionType.TEST) {
            return ResultFactory.create(ResultCode.UPDATE_EXT_DATA_FAIL_VERSION_TYPE_AUDIT_ERROR)
        }
        versionDO.extVersionAudit = ExtVersionAudit.AUDITTING
        this.versionRep.save(versionDO)
        return ResultFactory.success()
    }

    async versionBackJudge(extAuthorId: number, extVersionId: number) {
        const versionDO = await this.versionRep.findOne({ where: { extVersionId } })
        if (!versionDO) {
            return ResultFactory.create(ResultCode.UPDATE_EXT_DATA_FAIL)
        }
        const extMainDetail = await this.rep.findOne({ where: { extUuid: versionDO.extUuid, extAuthorId } })
        if (!extMainDetail) {
            return ResultFactory.create(ResultCode.UPDATE_EXT_DATA_FAIL)
        }
        if (versionDO.extVersionType != ExtVersionType.TEST || versionDO.extVersionAudit != ExtVersionAudit.AUDITTING) {
            return ResultFactory.create(ResultCode.UPDATE_EXT_DATA_FAIL_VERSION_TYPE_BACK_TEST_ERROR)
        }
        versionDO.extVersionAudit = ExtVersionAudit.NOT_AUDIT
        await this.versionRep.save(versionDO)
        return ResultFactory.success()
    }

    async versionCommitOnline(extAuthorId: number, extVersionId: number) {
        const versionDO = await this.versionRep.findOne({ where: { extVersionId } })
        if (!versionDO) {
            return ResultFactory.create(ResultCode.UPDATE_EXT_DATA_FAIL)
        }
        const extMainDetail = await this.rep.findOne({ where: { extUuid: versionDO.extUuid, extAuthorId } })
        if (!extMainDetail) {
            return ResultFactory.create(ResultCode.UPDATE_EXT_DATA_FAIL)
        }
        if (versionDO.extVersionType != ExtVersionType.TEST && versionDO.extVersionAudit != ExtVersionAudit.AUDIT_SUCCESS) {
            return ResultFactory.create(ResultCode.UPDATE_EXT_DATA_FAIL_VERSION_TYPE_AUDIT_ERROR)
        }
        versionDO.extVersionType = ExtVersionType.ONLINE
        versionDO.extVersionOnline = ExtVersionOnline.ONLINE
        await this.versionRep.save(versionDO)
        return ResultFactory.success()
    }

    async versionBackOnline(extAuthorId: number, extVersionId: number) {
        const versionDO = await this.versionRep.findOne({ where: { extVersionId } })
        if (!versionDO) {
            return ResultFactory.create(ResultCode.UPDATE_EXT_DATA_FAIL)
        }
        const extMainDetail = await this.rep.findOne({ where: { extUuid: versionDO.extUuid, extAuthorId } })
        if (!extMainDetail) {
            return ResultFactory.create(ResultCode.UPDATE_EXT_DATA_FAIL)
        }
        if (versionDO.extVersionType != ExtVersionType.ONLINE) {
            return ResultFactory.create(ResultCode.UPDATE_EXT_DATA_FAIL_VERSION_TYPE_BACK_TEST_ERROR)
        }
        versionDO.extVersionType = ExtVersionType.TEST
        versionDO.extVersionOnline = ExtVersionOnline.OFFLINE
        await this.versionRep.save(versionDO)
        return ResultFactory.success()
    }
}
