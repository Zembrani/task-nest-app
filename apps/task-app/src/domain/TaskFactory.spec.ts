import { Task } from "@app/shared/domain/TaskDomain";
import { TaskFactory } from "./TaskFactory";

describe('TaskFactory', () => {
  let factory: TaskFactory;

  beforeEach(() => {
    factory = new TaskFactory();
  });

  it('should create a Task with provided properties', () => {
    const partialTask: Partial<Task> = {
      title: 'Test Task',
      description: 'This is a test task',
    };

    const result = factory.create(partialTask);

    expect(result).toHaveProperty('id');
    expect(result.title).toBe(partialTask.title);
    expect(result.description).toBe(partialTask.description);
    expect(result.completed).toBe(false);
  });
});