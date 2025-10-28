import { TaskService } from './task.service';
import { Task } from '../../../../../libs/shared/src/domain/TaskDomain';
import { TaskEvents } from '../../../../../libs/shared/src/domain/events/event.constants';

describe('TaskService', () => {
  let service: TaskService;
  const mockRepo = {
    getAll: jest.fn(),
    getTaskById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  const mockAmqp = {
    publish: jest.fn(),
  };

  const sampleTask: Task = {
    id: 'abc123',
    title: 'Some title',
    description: 'Desc',
    completed: false,
  };

  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new TaskService(mockRepo as any, mockAmqp as any);
    // silence expected console.error calls from publish error handling
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('getAll should delegate to repository', async () => {
    mockRepo.getAll.mockResolvedValue([sampleTask]);
    const res = await service.getAll();
    expect(res).toEqual([sampleTask]);
    expect(mockRepo.getAll).toHaveBeenCalled();
  });

  it('getTaskById should return task when found and null when not', async () => {
    mockRepo.getTaskById.mockResolvedValueOnce(sampleTask);
    expect(await service.getTaskById(sampleTask.id)).toEqual(sampleTask);
    expect(mockRepo.getTaskById).toHaveBeenCalledWith(sampleTask.id);

    mockRepo.getTaskById.mockResolvedValueOnce(undefined);
    expect(await service.getTaskById('no-id')).toBeNull();
  });

  it('createTask should create and publish created event', async () => {
    mockRepo.create.mockResolvedValue(sampleTask);

    const res = await service.createTask({ title: sampleTask.title });
    expect(res).toEqual(sampleTask);
    expect(mockRepo.create).toHaveBeenCalledWith({ title: sampleTask.title });
    expect(mockAmqp.publish).toHaveBeenCalledWith(
      'task_exchange',
      TaskEvents.CREATED,
      expect.objectContaining({ data: sampleTask }),
      { persistent: true },
    );
  });

  it('createTask should not throw if publish fails', async () => {
    mockRepo.create.mockResolvedValue(sampleTask);
    mockAmqp.publish.mockImplementation(() => {
      throw new Error('publish error');
    });

    await expect(service.createTask({ title: sampleTask.title })).resolves.toEqual(
      sampleTask,
    );
    expect(mockRepo.create).toHaveBeenCalled();
    expect(mockAmqp.publish).toHaveBeenCalled();
  });

  it('updateTask should return null when task does not exist', async () => {
    mockRepo.getTaskById.mockResolvedValue(undefined);
    const res = await service.updateTask('no-id', { title: 'x' });
    expect(res).toBeNull();
    expect(mockRepo.getTaskById).toHaveBeenCalledWith('no-id');
    expect(mockAmqp.publish).not.toHaveBeenCalled();
  });

  it('updateTask should update, return updated and publish when update succeeds', async () => {
    const before = { ...sampleTask };
    const after = { ...sampleTask, title: 'updated' };

    mockRepo.getTaskById.mockResolvedValue(before);
    mockRepo.update.mockResolvedValue(after);

    const res = await service.updateTask(before.id, { title: 'updated' });
    expect(res).toEqual(after);
    expect(mockRepo.getTaskById).toHaveBeenCalledWith(before.id);
    expect(mockRepo.update).toHaveBeenCalledWith(before.id, { title: 'updated' });
    expect(mockAmqp.publish).toHaveBeenCalledWith(
      'task_exchange',
      TaskEvents.UPDATED,
      expect.objectContaining({ data: expect.objectContaining({ before, after }) }),
      { persistent: true },
    );
  });

  it('updateTask should return null and not publish when update returns null', async () => {
    const before = { ...sampleTask };
    mockRepo.getTaskById.mockResolvedValue(before);
    mockRepo.update.mockResolvedValue(null);

    const res = await service.updateTask(before.id, { title: 'updated' });
    expect(res).toBeNull();
    expect(mockAmqp.publish).not.toHaveBeenCalled();
  });

  it('deleteTask should delete when exists and always publish deleted event', async () => {
    mockRepo.getTaskById.mockResolvedValueOnce(sampleTask);
    mockRepo.delete.mockResolvedValue(undefined);

    await service.deleteTask(sampleTask.id);
    expect(mockRepo.getTaskById).toHaveBeenCalledWith(sampleTask.id);
    expect(mockRepo.delete).toHaveBeenCalledWith(sampleTask.id);
    expect(mockAmqp.publish).toHaveBeenCalledWith(
      'task_exchange',
      TaskEvents.DELETED,
      expect.objectContaining({ data: { id: sampleTask.id } }),
      { persistent: true },
    );
  });

  it('deleteTask should publish even if entity does not exist and not call delete', async () => {
    mockRepo.getTaskById.mockResolvedValueOnce(undefined);

    await service.deleteTask('no-id');
    expect(mockRepo.delete).not.toHaveBeenCalled();
    expect(mockAmqp.publish).toHaveBeenCalledWith(
      'task_exchange',
      TaskEvents.DELETED,
      expect.objectContaining({ data: { id: 'no-id' } }),
      { persistent: true },
    );
  });
});