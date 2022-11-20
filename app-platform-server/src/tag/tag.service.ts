import { Injectable } from '@nestjs/common';
import { tagData } from './data/tag.data';

@Injectable()
export class TagService {

    findAllTagList() {
        return tagData;
    }
}
