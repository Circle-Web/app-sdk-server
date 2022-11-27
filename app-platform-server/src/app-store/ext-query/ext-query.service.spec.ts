import { Test, TestingModule } from '@nestjs/testing';
import { ExtQueryService } from './ext-query.service';

describe('ExtQueryService', () => {
  let service: ExtQueryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExtQueryService],
    }).compile();

    service = module.get<ExtQueryService>(ExtQueryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
