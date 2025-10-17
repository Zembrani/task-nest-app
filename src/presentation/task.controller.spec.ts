import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { Task, TaskParamDTO, UpdateTaskDTO, CreateTaskDTO } from 'src/domain/TaskDomain';
import { ITaskService } from 'src/application/services/ITask.service';
import { NotFoundException } from '@nestjs/common';

const mockTaskService = {
  getAll: jest.fn(),
  getTaskById: jest.fn(),
  createTask: jest.fn(),
  updateTask: jest.fn(),
  deleteTask: jest.fn(),
};

describe('TaskController', () => {
  let taskController: TaskController;

  const genericTask: Task = {
    id: '7urrt5d',
    title: 'Title',
    description: 'Some description',
    completed: false,
  };
  const genericIdParam: TaskParamDTO = { id: '7urrt5d' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: 'ITaskService',
          useValue: mockTaskService,
        },
      ],
    }).compile();

    taskController = module.get<TaskController>(TaskController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(taskController).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array of tasks', async () => {
      mockTaskService.getAll.mockResolvedValue([genericTask]);

      const result = await taskController.getAll();

      expect(result).toEqual([genericTask]);
      expect(mockTaskService.getAll).toHaveBeenCalled();
    });
  });

  describe('getTaskById', () => {
    it('should return a single task when found', async () => {
      mockTaskService.getTaskById.mockResolvedValue(genericTask);

      const result = await taskController.getTaskById(genericIdParam);

      expect(result).toEqual(genericTask);
      expect(mockTaskService.getTaskById).toHaveBeenCalledWith(genericIdParam.id);
    });
  });

  describe('createTask', () => {
    it('should create and return a task', async () => {
        const createTaskDTO: CreateTaskDTO = { title: 'New Task', description: 'New Desc' };
        mockTaskService.createTask.mockResolvedValue({ ...genericTask, ...createTaskDTO });

        const result = await taskController.createTask(createTaskDTO);

        expect(result.title).toBe(createTaskDTO.title);
        expect(mockTaskService.createTask).toHaveBeenCalledWith(createTaskDTO);
    });
  });

  describe('updateTask', () => {
    it('should create and return a task', async () => {
        const updateTaskDTO: UpdateTaskDTO = { title: 'Updated Task', description: 'Updated Desc', completed: true };
        mockTaskService.updateTask.mockResolvedValue({ ...genericTask, ...updateTaskDTO });

        const result = await taskController.updateTask(genericIdParam, updateTaskDTO);

        expect(result.title).toBe(updateTaskDTO.title);
        expect(mockTaskService.updateTask).toHaveBeenCalledWith(genericIdParam.id, updateTaskDTO);
    });
  });

  describe('deleteTask', () => {
    it('should create and return a task', async () => {
        mockTaskService.deleteTask.mockResolvedValue(null);

        const result = await taskController.deleteTask(genericIdParam);

        expect(result).toBe(`Removeu o id ${genericIdParam.id}`);
        expect(mockTaskService.deleteTask).toHaveBeenCalledWith(genericIdParam.id);
    });
  });
});
