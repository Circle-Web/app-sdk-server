
// @Entity('ext_main_detail')
export class ExtMainDetail {
    extUuid: number
    extName: string
    extIcon: string
    extLogo: string
    extBrief: string
    extDescription: string
    extMarketSnapshots: string
    extAuthorId: number
    extStatus: number
    extVersion: string
    extVersionOnline: number
    extVersionPrivacy: number
    extVersionTerms: number
    keywords: string
    createTime: Date
    updateTime: Date
    like: number
}
