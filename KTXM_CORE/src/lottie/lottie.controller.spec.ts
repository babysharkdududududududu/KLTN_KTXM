import { Test, TestingModule } from '@nestjs/testing';
import { LottieController } from './lottie.controller';

describe('LottieController', () => {
  let controller: LottieController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LottieController],
    }).compile();

    controller = module.get<LottieController>(LottieController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
