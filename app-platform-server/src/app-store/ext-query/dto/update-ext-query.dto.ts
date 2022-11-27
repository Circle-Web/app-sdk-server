import { PartialType } from '@nestjs/mapped-types';
import { CreateExtQueryDto } from './create-ext-query.dto';

export class UpdateExtQueryDto extends PartialType(CreateExtQueryDto) {}
