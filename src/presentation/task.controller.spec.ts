import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from '../application/services/task.service';

describe('AppController', () => {
  let taskController: TaskController;
  let taskService: TaskService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [TaskService],
    }).compile();

    taskController = app.get<TaskController>(TaskController);
    taskService = app.get<TaskService>(TaskService);
  });

  describe('tasks', () => {
    describe('getAll', () => {
      it('should return success', () => {
        const response = 'success';
        jest.spyOn(taskService, 'getAll').mockImplementation(() => response);

        expect(taskController.getAll()).toBe(response);
      });
    });

    describe('getTaskById', () => {
      it('should return success', () => {
        const response = 'success';
        const id = '1234567';

        jest
          .spyOn(taskService, 'getTaskById')
          .mockImplementation(() => response);
        expect(taskController.getTaskById(id)).toBe(response);
      });
    });

    describe('createTask', () => {
      it('should return success', () => {
        const response = 'success';
        const task = { title: 'test', description: 'test' };

        jest
          .spyOn(taskService, 'createTask')
          .mockImplementation(() => response);
        expect(taskController.createTask(task)).toBe(response);
      });
    });

    describe('updateTask', () => {
      it('should return success', () => {
        const response = 'success';
        const id = '1234567';
        const task = { title: 'test', description: 'test' };

        jest
          .spyOn(taskService, 'updateTask')
          .mockImplementation(() => response);
        expect(taskController.updateTask(id, task)).toBe(response);
      });
    });

    describe('deleteTask', () => {
      it('should return success', () => {
        const response = 'success';
        const id = '1234567';
        const deleteResponse = `Removeu o id ${id}`;

        jest
          .spyOn(taskService, 'deleteTask')
          .mockImplementation(() => response);
        expect(taskController.deleteTask(id)).toBe(deleteResponse);
      });
    });
  });
});
