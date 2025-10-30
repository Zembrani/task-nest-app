import { RabbitmqSubscriber } from './rabbitmq.subscriber';
import { Nack } from '@golevelup/nestjs-rabbitmq';

describe('RabbitmqSubscriber', () => {
  let subscriber: RabbitmqSubscriber;
  let logSpy: jest.SpyInstance;
  let errorSpy: jest.SpyInstance;

  const samplePayload = {
    id: 'evt-1',
    timestamp: new Date(),
    actor: { userId: 'tester' },
    data: { id: 'task-1', title: 'T1', description: 'D1', completed: false },
  };

  beforeEach(() => {
    subscriber = new RabbitmqSubscriber();
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
    logSpy.mockRestore();
    errorSpy.mockRestore();
  });

  it('handleTaskCreatedSub should log event and return undefined on success', async () => {
    const res = await subscriber.handleTaskCreatedSub(samplePayload as any);
    expect(res).toBeUndefined();
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('Event Task created - id:'),
    );
  });

  it('handleTaskUpdatedSub should log event and return undefined on success', async () => {
    const payload = {
      ...samplePayload,
      data: { before: samplePayload.data, after: samplePayload.data },
    };
    const res = await subscriber.handleTaskUpdatedSub(payload as any);
    expect(res).toBeUndefined();
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('Event Task updated - id:'),
    );
  });

  it('handleTaskDeletedSub should log event and return undefined on success', async () => {
    const payload = { ...samplePayload, data: { id: samplePayload.data.id } };
    const res = await subscriber.handleTaskDeletedSub(payload as any);
    expect(res).toBeUndefined();
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('Event Task deleted - id:'),
    );
  });

  it('handleTaskCreatedSub should return Nack when an error is thrown', async () => {
    // calling with null will cause destructuring to throw and be caught
    const res = await subscriber.handleTaskCreatedSub(null as unknown as any);
    expect(res).toBeInstanceOf(Nack);
    expect(errorSpy).toHaveBeenCalled();
  });

  it('handleTaskUpdatedSub should return Nack when an error is thrown', async () => {
    const res = await subscriber.handleTaskUpdatedSub(null as unknown as any);
    expect(res).toBeInstanceOf(Nack);
    expect(errorSpy).toHaveBeenCalled();
  });

  it('handleTaskDeletedSub should return Nack when an error is thrown', async () => {
    const res = await subscriber.handleTaskDeletedSub(null as unknown as any);
    expect(res).toBeInstanceOf(Nack);
    expect(errorSpy).toHaveBeenCalled();
  });
});
