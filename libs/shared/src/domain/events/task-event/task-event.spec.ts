import { Test, TestingModule } from '@nestjs/testing';
import {
  BaseEvent,
  TaskCreatedEvent,
  TaskDeletedEvent,
  TaskUpdatedEvent,
} from './task-event';

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

const sampleEntity = {
  id: 'abc123',
  title: 'Some title',
  description: 'Desc',
  completed: false,
};

describe('TaskCreatedEvent', () => {
  it('should create an event with correct data and actorId', () => {
    const event = new TaskCreatedEvent(sampleEntity, 'user1');

    expect(event.data).toEqual(sampleEntity);
    expect(event.actor.userId).toBe('user1');
  });
});

describe('TaskUpdatedEvent', () => {
  const sampleEntityAfter = {
    id: 'abc123',
    title: 'Some title',
    description: 'Desc',
    completed: false,
  };

  const payload = { before: sampleEntity, after: sampleEntityAfter };
  it('should create an event with correct data and actorId', () => {
    const event = new TaskUpdatedEvent(payload, 'user1');

    expect(event.data).toEqual(payload);
    expect(event.actor.userId).toBe('user1');
  });
});

describe('TaskDeletedEvent', () => {
  const payload = { id: sampleEntity.id };
  it('should create an event with correct data and actorId', () => {
    const event = new TaskDeletedEvent(payload, 'user1');

    expect(event.data).toEqual(payload);
    expect(event.actor.userId).toBe('user1');
  });
});
