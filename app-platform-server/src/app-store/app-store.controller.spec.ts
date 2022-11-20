import { Test, TestingModule } from '@nestjs/testing';
import { AppStoreController } from './app-store.controller';
import { AppStoreService } from './app-store.service';

describe('AppStoreController', () => {
  let controller: AppStoreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppStoreController],
      providers: [AppStoreService],
    }).compile();

    controller = module.get<AppStoreController>(AppStoreController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
