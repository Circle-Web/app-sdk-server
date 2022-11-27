import { Test, TestingModule } from '@nestjs/testing';
import { ExtQueryController } from './ext-query.controller';
import { ExtQueryService } from './ext-query.service';

describe('ExtQueryController', () => {
  let controller: ExtQueryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExtQueryController],
      providers: [ExtQueryService],
    }).compile();

    controller = module.get<ExtQueryController>(ExtQueryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
