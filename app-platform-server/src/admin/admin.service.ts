import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminService {
  review(extUuid: string, state: number) {

  }

  findOne(account: string) {
    return `This action returns a dmin`;
  }

}
