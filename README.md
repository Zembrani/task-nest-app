Task Management API - Event-Driven Microservices with Nest.js

This project demonstrates a robust backend system built using a modern technology stack, focusing on Clean Architecture, Domain-Driven Design (DDD), and event-driven communication between microservices. It features a Task Management API (task-app) that communicates asynchronously with a simple Notification service (notification) via RabbitMQ.

✨ Key Concepts & Features Demonstrated

This project serves as a practical example of implementing several advanced backend concepts:

Microservices Architecture: Two distinct Nest.js applications (task-app and notification) running independently.

Clean Architecture: Strict separation of concerns into Domain, Application, Infrastructure, and Presentation layers, promoting maintainability and testability.

Domain-Driven Design (DDD):

Bounded Contexts: Each microservice represents a distinct Bounded Context (Task Management, Notifications).

Ubiquitous Language: Consistent terminology used across the codebase (e.g., Task, TaskCreatedEvent).

Entities: Task as the core domain entity.

Repositories: Abstracting data persistence (ITaskRepository).

Domain Events: Modeling significant business occurrences (TaskCreatedEvent, TaskUpdatedEvent, TaskDeletedEvent) for asynchronous communication.

Event-Driven Communication: Utilizing RabbitMQ as a message broker for decoupled, asynchronous communication between the task-app (Producer) and notification app (Consumer).

Nest.js Framework: Leveraging Nest.js modules, dependency injection, controllers, services, pipes, and lifecycle hooks for a structured and scalable application.

TypeORM & PostgreSQL: Implementing data persistence using TypeORM entities and repositories, connected to a PostgreSQL database.

API Validation: Robust request validation using class-validator and Nest.js ValidationPipe for both request bodies and URL parameters (DTOs).

Unit Testing: Isolated unit tests for the controller layer using Jest and Nest.js testing utilities, mocking dependencies effectively.

Docker Compose: Simplified setup and management of external services (PostgreSQL, RabbitMQ) for local development.

TypeScript: Leveraging strong typing for improved code quality and maintainability.

🏛️ Architecture Overview

The system consists of two main services orchestrated by Docker Compose:

task-app (Port 3000):

A Nest.js application providing a REST API for CRUD operations on Tasks.

Follows Clean Architecture principles.

Persists data to the PostgreSQL database via TypeORM.

Acts as a Producer: Publishes domain events (TaskCreated, TaskUpdated, TaskDeleted) to the task_exchange in RabbitMQ.

notification (Port 3001):

A lightweight Nest.js application.

Acts as a Consumer: Subscribes to specific routing keys on the task_exchange in RabbitMQ.

Listens for task-related events and logs a message to the console (simulating a notification action).

RabbitMQ:

Message broker handling the asynchronous communication between services via the task_exchange.

PostgreSQL:

Relational database storing the task data for the task-app.

🛠️ Technologies Used

Framework: Nest.js (^11.x)

Language: TypeScript (^5.x)

Database: PostgreSQL (via Docker)

ORM: TypeORM (^0.3.x)

Message Broker: RabbitMQ (via Docker, using @golevelup/nestjs-rabbitmq)

Validation: class-validator, class-transformer

Testing: Jest (^30.x), Supertest

Containerization: Docker, Docker Compose

API Client: Postman, Insomnia

🏗️ Project Structure

This project follows a Nest.js monorepo structure:

├── apps/
│   ├── task-app/         # Task Management microservice
│   │   ├── src/
│   │   │   ├── application/  # Services, Repositories (Interfaces), Listeners (Removed)
│   │   │   ├── domain/       # Core Entities, Domain Events (Moved to Libs)
│   │   │   ├── infrastructure/ # DB Entities, Repositories (Impl), Messaging (Config)
│   │   │   └── presentation/   # Controllers, Modules
│   │   └── ...
│   └── notification/     # Notification microservice
│       ├── src/
│       │   ├── listeners/    # RabbitMQ Subscriber logic
│       │   └── ...           # main.ts, module, etc.
│       └── ...
├── libs/
│   └── shared/           # Shared code (interfaces, DTOs, events) between services
│       └── src/
│           ├── domain/
│           │   ├── events/   # Event definitions (constants, classes)
│           │   └── TaskDomain.ts # Task interface/class, DTOs
│           └── ...
├── docker-compose.yml    # Docker setup for Postgres & RabbitMQ
├── package.json
└── tsconfig.json


🚀 Getting Started

Prerequisites

Node.js (v18 or higher recommended)

npm or yarn

Docker & Docker Compose

Installation & Setup

Clone the repository:

git clone [https://github.com/Zembrani/task-nest-app.git](https://github.com/Zembrani/task-nest-app.git)
cd task-nest-app


Install dependencies:

npm install
# or
yarn install


Start external services (Database & Message Broker):

docker-compose up -d


This will start PostgreSQL and RabbitMQ containers in the background. You can access the RabbitMQ Management UI at http://localhost:15672 (login: guest/guest).

Running the Application (Development)

You need to run both microservices simultaneously in separate terminals:

Terminal 1 (Start Task Service):

npm run start:dev:task


This will start the task-app on http://localhost:3000.

Terminal 2 (Start Notification Service):

npm run start:dev:notification


This will start the notification app on http://localhost:3001.

Wait for both applications to show that they have successfully connected to RabbitMQ.

✅ Running Tests

To run the unit tests for the task-app controller:

npm run test apps/task-app/src/presentation/task.controller.spec.ts
# Or run all tests defined in jest config
# npm test


🔌 API Endpoints (task-app on Port 3000)

GET /tasks: Get all tasks.

GET /tasks/:id: Get a single task by its UUID.

POST /tasks: Create a new task.

Body: { "title": "string", "description": "string" }

Triggers task.created event.

PUT /tasks/:id: Update an existing task.

Body: { "title"?: "string", "description"?: "string", "completed"?: boolean } (At least one field required)

Triggers task.updated event.

DELETE /tasks/:id: Delete a task.

Triggers task.deleted event.

(Note: When triggering POST, PUT, or DELETE, check the console output of the notification service running on port 3001 to see the event being consumed).

💡 Future Enhancements (Ideas)

Implement Authentication/Authorization (e.g., JWT).

Add more complex business logic to the Domain Entities.

Introduce Kafka as an alternative/additional message broker.

Implement Integration Tests.

Refine error handling and logging further.

Deploy services using container orchestration (e.g., Kubernetes).

This project was developed as part of a learning journey focusing on advanced backend architecture and design patterns.