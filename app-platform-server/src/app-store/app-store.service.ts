import { Injectable } from '@nestjs/common';
import { CreateAppStoreDto } from './dto/create-app-store.dto';

@Injectable()
export class AppStoreService {
  getExtMainDetail(extUuid: string) {
    throw new Error('Method not implemented.');
  }
  getExtList(tagId: number, currentPage: number, pageSize: number) {
    throw new Error('Method not implemented.');
  }
  create(createAppStoreDto: CreateAppStoreDto) {
    return 'This action adds a new appStore';
  }

  findAll() {
    return `This action returns all appStore`;
  }

  findExtList(key: string) {
    return `This action returns a #${key} appStore`;
  }


  remove(id: number) {
    return `This action removes a #${id} appStore`;
  }
}
