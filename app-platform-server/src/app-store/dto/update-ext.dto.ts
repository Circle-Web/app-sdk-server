import { PartialType } from "@nestjs/mapped-types"
import { CreateExtDto } from "./create-ext.dto"

export class UpdateExtDto extends PartialType(CreateExtDto) {
    extVersionId: number
    extName: string
    extMainUrl: string
    extDescription: string
    extBrief: string
    extLogo: string
    extMarketSnapshots: string[]
}
