import { InMemoryTaskRepository } from './InMemoryTaskRepository';
import { TaskFactory } from '../../domain/TaskFactory';
import { Task } from '../../../../../libs/shared/src/domain/TaskDomain';

describe('InMemoryTaskRepository', () => {
  let repo: InMemoryTaskRepository;
  const mockFactory: Partial<TaskFactory> = {
    create: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    repo = new InMemoryTaskRepository(mockFactory as TaskFactory);
  });

  it('getAll should return empty array initially', async () => {
    const result = await repo.getAll();
    expect(result).toEqual([]);
  });

  it('create should use factory, store and return the new task', async () => {
    const input = { title: 'New Task', description: 'New Desc' };
    const created: Task = {
      id: 'id-1',
      title: input.title,
      description: input.description,
      completed: false,
    };
    (mockFactory.create as jest.Mock).mockReturnValue(created);

    const result = await repo.create(input);

    expect(result).toEqual(created);
    expect(mockFactory.create).toHaveBeenCalledWith(input);
    expect(await repo.getAll()).toEqual([created]);
  });

  it('getTaskById should return task when exists', async () => {
    const created: Task = {
      id: 'id-2',
      title: 'T2',
      description: 'D2',
      completed: false,
    };
    (mockFactory.create as jest.Mock).mockReturnValue(created);
    await repo.create({ title: created.title, description: created.description });

    const found = await repo.getTaskById('id-2');
    expect(found).toEqual(created);
  });

  it('getTaskById should return undefined when not found', async () => {
    const found = await repo.getTaskById('no-id');
    expect(found).toBeUndefined();
  });

  it('update should return updated task when found', async () => {
    const created: Task = {
      id: 'id-3',
      title: 'T3',
      description: 'D3',
      completed: false,
    };
    (mockFactory.create as jest.Mock).mockReturnValue(created);
    await repo.create({ title: created.title, description: created.description });

    const updated = await repo.update('id-3', { title: 'Updated', completed: true });

    expect(updated).toEqual({ ...created, title: 'Updated', completed: true });
    expect(await repo.getTaskById('id-3')).toEqual({ ...created, title: 'Updated', completed: true });
  });

  it('update should return null when entity does not exist', async () => {
    const result = await repo.update('not-found', { title: 'x' });
    expect(result).toBeNull();
  });

  it('delete should remove task when exists and do nothing otherwise', async () => {
    const created: Task = {
      id: 'id-4',
      title: 'T4',
      description: 'D4',
      completed: false,
    };
    (mockFactory.create as jest.Mock).mockReturnValue(created);
    await repo.create({ title: created.title, description: created.description });

    await repo.delete('id-4');
    expect(await repo.getAll()).toEqual([]);
    expect(await repo.getTaskById('id-4')).toBeUndefined();

    // deleting non-existing id should not throw
    await expect(repo.delete('no-id')).resolves.toBeUndefined();
  });
});