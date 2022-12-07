import { PartialType } from '@nestjs/mapped-types';
import { CreateVoteExtDto } from './create-vote-ext.dto';

export class UpdateVoteExtDto extends PartialType(CreateVoteExtDto) {}
