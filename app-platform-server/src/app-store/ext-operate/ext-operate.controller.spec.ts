import { Test, TestingModule } from '@nestjs/testing';
import { ExtOperateController } from './ext-operate.controller';

describe('ExtOperateController', () => {
  let controller: ExtOperateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExtOperateController],
    }).compile();

    controller = module.get<ExtOperateController>(ExtOperateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
