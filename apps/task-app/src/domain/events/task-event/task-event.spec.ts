import { Test, TestingModule } from '@nestjs/testing';
import { BaseEvent } from './task-event';

describe('BaseEvent', () => {
  let provider: BaseEvent;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BaseEvent],
    }).compile();

    provider = module.get<BaseEvent>(BaseEvent);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
