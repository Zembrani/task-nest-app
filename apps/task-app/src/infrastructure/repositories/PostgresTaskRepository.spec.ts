import { PostgresTaskRepository } from './PostgresTaskRepository';
import { Repository } from 'typeorm';
import { Task } from '../../../../../libs/shared/src/domain/TaskDomain';

describe('PostgresTaskRepository', () => {
  let repo: PostgresTaskRepository;
  const mockRepository: Partial<Repository<any>> = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  const sampleEntity = {
    id: 'abc123',
    title: 'Some title',
    description: 'Desc',
    completed: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    repo = new PostgresTaskRepository(
      mockRepository as unknown as Repository<any>,
    );
  });

  it('getAll should return mapped Task array', async () => {
    (mockRepository.find as jest.Mock).mockResolvedValue([sampleEntity]);

    const result = await repo.getAll();

    expect(result).toEqual([
      {
        id: sampleEntity.id,
        title: sampleEntity.title,
        description: sampleEntity.description,
        completed: sampleEntity.completed,
      } as Task,
    ]);
    expect(mockRepository.find).toHaveBeenCalled();
  });

  it('getTaskById should return mapped Task when found', async () => {
    (mockRepository.findOne as jest.Mock).mockResolvedValue(sampleEntity);

    const result = await repo.getTaskById(sampleEntity.id);

    expect(result).toEqual({
      id: sampleEntity.id,
      title: sampleEntity.title,
      description: sampleEntity.description,
      completed: sampleEntity.completed,
    } as Task);
    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { id: sampleEntity.id },
    });
  });

  it('getTaskById should return undefined when not found', async () => {
    (mockRepository.findOne as jest.Mock).mockResolvedValue(undefined);

    const result = await repo.getTaskById('no-id');

    expect(result).toBeUndefined();
    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { id: 'no-id' },
    });
  });

  it('create should save and return mapped Task', async () => {
    const input = { title: 'New', description: 'd' };
    const saved = { ...sampleEntity, ...input };
    (mockRepository.save as jest.Mock).mockResolvedValue(saved);

    const result = await repo.create(input);

    expect(result).toEqual({
      id: saved.id,
      title: saved.title,
      description: saved.description,
      completed: saved.completed,
    } as Task);
    expect(mockRepository.save).toHaveBeenCalledWith(input);
  });

  it('update should return mapped Task when entity exists', async () => {
    const updateData = { id: sampleEntity.id, title: 'Updated' };
    const existing = { ...sampleEntity };
    const saved = { ...existing, ...updateData };
    (mockRepository.findOne as jest.Mock).mockResolvedValue(existing);
    (mockRepository.save as jest.Mock).mockResolvedValue(saved);

    const result = await repo.update(updateData);

    expect(result).toEqual({
      id: saved.id,
      title: saved.title,
      description: saved.description,
      completed: saved.completed,
    } as Task);
    expect(mockRepository.save).toHaveBeenCalled();
  });

  it('delete should call repository.delete with id', async () => {
    (mockRepository.delete as jest.Mock).mockResolvedValue(undefined);

    await repo.delete(sampleEntity.id);

    expect(mockRepository.delete).toHaveBeenCalledWith(sampleEntity.id);
  });
});
