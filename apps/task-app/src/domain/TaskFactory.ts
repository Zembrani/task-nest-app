import { Task } from '../../../../libs/shared/src/domain/TaskDomain';

export class TaskFactory {
  create(task: Partial<Task>): Task {
    const newTask: Task = {
      id: Math.random().toString(36).substring(2, 9),
      title: task.title || '',
      description: task.description || '',
      completed: false,
    };

    return newTask;
  }
}
