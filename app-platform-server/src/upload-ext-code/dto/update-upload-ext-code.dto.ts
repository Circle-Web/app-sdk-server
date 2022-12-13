import { PartialType } from '@nestjs/mapped-types';
import { CreateUploadExtCodeDto } from './create-upload-ext-code.dto';

export class UpdateUploadExtCodeDto extends PartialType(CreateUploadExtCodeDto) {}
