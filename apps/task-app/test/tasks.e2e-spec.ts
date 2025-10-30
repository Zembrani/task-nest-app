import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { TaskModule } from '../src/app.module';
import { TaskEntity } from '../src/infrastructure/database/task.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('TasksController (e2e)', () => {
  let app: INestApplication<App>;
  let taskRepository: Repository<TaskEntity>;

  beforeAll(async () => {
    process.env.POSTGRES_DATABASE = 'tasks_test';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TaskModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    await app.init();

    taskRepository = moduleFixture.get<Repository<TaskEntity>>(
      getRepositoryToken(TaskEntity),
    );
  });

  beforeEach(async () => {
    await taskRepository.clear();
  });

  it('/ (POST)', () => {
    const newTask = {
      title: 'New task',
      description: 'Creating a new task.',
    };
    return request(app.getHttpServer())
      .post('/tasks')
      .send(newTask)
      .expect(201)
      .expect(({ body }) => {
        expect(body.title).toEqual(newTask.title);
        expect(body.description).toEqual(newTask.description);
        expect(body.id).toBeDefined();
        expect(body.completed).toEqual(false);
      });
  });

  it('/ (GET)', async () => {
    const newTask = {
      title: 'New task',
      description: 'Creating a new task.',
    };

    const createdTask = await request(app.getHttpServer())
      .post('/tasks')
      .send(newTask)
      .expect(201);

    return request(app.getHttpServer())
      .get('/tasks')
      .expect(200)
      .expect(({ body }) => {
        expect(body[0].id).toEqual(createdTask.body.id);
        expect(body[0].title).toEqual(newTask.title);
        expect(body[0].description).toEqual(newTask.description);
        expect(body[0].completed).toEqual(false);
      });
  });

  it('/:id (GET)', async () => {
    const newTask = {
      title: 'New task',
      description: 'Creating a new task.',
    };

    const createdTask = await request(app.getHttpServer())
      .post('/tasks')
      .send(newTask)
      .expect(201);

    return request(app.getHttpServer())
      .get('/tasks/' + createdTask.body.id)
      .expect(200)
      .expect(({ body }) => {
        expect(body.id).toEqual(createdTask.body.id);
        expect(body.title).toEqual(newTask.title);
        expect(body.description).toEqual(newTask.description);
        expect(body.completed).toEqual(false);
      });
  });

  it('/:id (GET) Task not found', async () => {
    const id = 'abc123d4-b7a0-4cec-88e1-b9f26aec85d1';
    return request(app.getHttpServer())
      .get('/tasks/' + id)
      .expect(404)
      .expect(({ body }) => {
        expect(body.message).toEqual('Task not found.');
      });
  });

  it('/:id (PUT)', async () => {
    const newTask = {
      title: 'New task',
      description: 'Creating a new task.',
    };

    const updateTask = {
      title: 'Updated task',
      description: 'Updating a new task.',
      completed: true,
    };

    const createdTask = await request(app.getHttpServer())
      .post('/tasks')
      .send(newTask)
      .expect(201);

    return request(app.getHttpServer())
      .put('/tasks/' + createdTask.body.id)
      .send(updateTask)
      .expect(200)
      .expect(({ body }) => {
        expect(body.id).toEqual(createdTask.body.id);
        expect(body.title).toEqual(updateTask.title);
        expect(body.description).toEqual(updateTask.description);
        expect(body.completed).toEqual(updateTask.completed);
      });
  });

  it('/:id (PUT) Task not found.', async () => {
    const id = 'abc123d4-b7a0-4cec-88e1-b9f26aec85d1';

    const updateTask = {
      title: 'Updated task',
      description: 'Updating a new task.',
      completed: true,
    };

    return request(app.getHttpServer())
      .put('/tasks/' + id)
      .send(updateTask)
      .expect(404)
      .expect(({ body }) => {
        expect(body.message).toEqual('Task not found.');
      });
  });

  it('/:id (DELETE)', async () => {
    const newTask = {
      title: 'New task',
      description: 'Creating a new task.',
    };

    const createdTask = await request(app.getHttpServer())
      .post('/tasks')
      .send(newTask)
      .expect(201);

    return request(app.getHttpServer())
      .delete('/tasks/' + createdTask.body.id)
      .expect(200)
      .expect((body) => {
        expect(body.text).toEqual(
          `Task id ${createdTask.body.id} deleted successfully.`,
        );
      });
  });

  it('/:id (DELETE) Task not found.', async () => {
    const id = 'abc123d4-b7a0-4cec-88e1-b9f26aec85d1';

    return request(app.getHttpServer())
      .delete('/tasks/' + id)
      .expect(404)
      .expect(({ body }) => {
        expect(body.message).toEqual('Task not found.');
      });
  });
});
