import { Injectable } from '@nestjs/common';
import { ResultFactory } from 'src/utils/result/resultFactory';
import { tagData } from './data/tag.data';

@Injectable()
export class TagService {
  constructor(
  ) { }

  findAllTagList() {
    return ResultFactory.success(tagData);
  }
}
