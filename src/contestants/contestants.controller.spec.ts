import { Test, TestingModule } from '@nestjs/testing';
import { ContestantsController } from './contestants.controller';

describe('ContestantsController', () => {
  let controller: ContestantsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContestantsController],
    }).compile();

    controller = module.get<ContestantsController>(ContestantsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
