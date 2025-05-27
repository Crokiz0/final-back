import { Test, TestingModule } from '@nestjs/testing';
import { DictatorsService } from './dictators.service';

describe('DictatorsService', () => {
  let service: DictatorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DictatorsService],
    }).compile();

    service = module.get<DictatorsService>(DictatorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
