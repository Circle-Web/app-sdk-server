import { PartialType } from "@nestjs/mapped-types";
import { PageParam } from "src/common/dto/page.dto";

export class ExtListDto extends PartialType(PageParam) {
    tagId?: number
}