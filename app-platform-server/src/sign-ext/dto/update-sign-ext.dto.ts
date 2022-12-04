import { PartialType } from '@nestjs/mapped-types';
import { CreateSignExtDto } from './create-sign-ext.dto';

export class UpdateSignExtDto extends PartialType(CreateSignExtDto) {}
