import { Test, TestingModule } from '@nestjs/testing';
import { ExtOperateService } from './ext-operate.service';

describe('ExtOperateServiceService', () => {
  let service: ExtOperateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExtOperateService],
    }).compile();

    service = module.get<ExtOperateService>(ExtOperateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
