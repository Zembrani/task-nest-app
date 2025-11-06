Task Management Microservices (Nest.js, DDD, RabbitMQ, JWT)

This project demonstrates a robust, event-driven backend system built on a Nest.js monorepo. It features three distinct microservices that communicate asynchronously using RabbitMQ, showcasing a full implementation of Clean Architecture, Domain-Driven Design (DDD) principles, and secure JWT authentication.

The three services are:

task-app: A "Resource Server" providing a protected REST API for CRUD operations on Tasks.

notification-app: A "Consumer" service that listens for task-related events and logs them (simulating sending notifications).

authentication-app: An "Auth Server" that acts as the system's identity provider, handling user registration and issuing JSON Web Tokens (JWT).

✨ Key Concepts & Features Demonstrated

This project serves as a practical, portfolio-ready example of implementing several advanced backend concepts:

Microservices Architecture: Three distinct Nest.js applications (task-app, notification-app, authentication-app) running independently within a monorepo.

Authentication & Authorization:

JWT (JSON Web Token): A dedicated authentication-app handles user registration (/auth/register) and login (/auth/login), issuing secure JWTs.

Password Hashing: Uses bcrypt to securely hash and compare user passwords.

Guards: The task-app acts as a "Resource Server" that uses a shared AuthGuard to protect its endpoints, validating JWTs on incoming requests.

Clean Architecture: Strict separation of concerns in each service into Domain, Application, Infrastructure, and Presentation layers.

Domain-Driven Design (DDD):

Bounded Contexts: Each microservice represents a distinct Bounded Context (Task Management, Notifications, Authentication).

Entities & Aggregates: Task and User as core domain entities.

Repositories: Abstracting data persistence (ITaskRepository, IUserRepository).

Domain Events: Modeling business occurrences (TaskCreatedEvent, TaskUpdatedEvent) as type-safe classes with metadata (eventId, timestamp).

Event-Driven Communication: Utilizing RabbitMQ as a message broker for decoupled, asynchronous communication between the task-app (Producer) and notification-app (Consumer).

Data Persistence: Using TypeORM and PostgreSQL for data persistence. Each service manages its own tables (tasks and users) within the same shared database.

API Validation: Robust request validation using class-validator and Nest.js ValidationPipe for both request bodies (@Body()) and URL parameters (@Param()).

Testing:

Unit Tests: Complete test suites for controllers and services (*.spec.ts) using Jest, mocking dependencies (Repositories, Services) to test logic in isolation.

E2E Tests: Integration tests (*.e2e-spec.ts) using Supertest to make real HTTP requests against the API and validate responses against a separate test database.

Docker Compose: A single docker-compose.yml file to set up and run all required external services (PostgreSQL, RabbitMQ) with persistent data volumes.

Monorepo Structure: Using libs/shared to share common code (like DTOs, event definitions, and the AuthGuard) between services.

🏛️ Architecture Overview

The system is composed of three separate services that interact with each other and with external infrastructure.

authentication-app (Port 3001)

Provides public endpoints for POST /auth/register and POST /auth/login.

Hashes passwords using bcrypt.

Validates user credentials against the users table in PostgreSQL.

Creates and signs JWTs using a shared secret.

task-app (Port 3000)

Provides protected endpoints (/tasks) for managing tasks.

Uses a shared AuthGuard to verify the Authorization: Bearer <token> header on all requests.

Performs business logic and validation (e.g., throwing NotFoundException if a task doesn't exist).

Saves data to the tasks table in PostgreSQL.

Publishes domain events (e.g., task.created) to the task_exchange in RabbitMQ.

notification-app (Port 3002)

Has no public API endpoints.

Connects to RabbitMQ on startup.

Subscribes to events (like task.created) from the task_exchange.

Logs the received event data, simulating an action like sending an email or push notification.

🛠️ Technologies Used

Framework: Nest.js (^11.x)

Language: TypeScript (^5.x)

Database: PostgreSQL (via Docker)

ORM: TypeORM (^0.3.x)

Messaging: RabbitMQ (via Docker, using @golevelup/nestjs-rabbitmq)

Authentication: JWT (@nestjs/jwt), bcrypt

Validation: class-validator, class-transformer

Testing: Jest (^30.x), Supertest

Containerization: Docker, Docker Compose

🏗️ Project Structure

This project follows a Nest.js monorepo structure:

├── apps/
│   ├── task-app/            # Task Management microservice (Resource Server)
│   ├── notification-app/    # Notification microservice (Consumer)
│   └── authentication-app/  # Authentication microservice (Auth Server)
├── libs/
│   └── shared/              # Shared code (DTOs, Events, Guards)
│       └── src/
│           ├── constants/   # jwtConstants.ts
│           ├── domain/      # TaskDomain.ts, UserDomain.ts
│           ├── events/      # event.constants.ts, task.events.ts
│           └── guards/      # auth.guard.ts
├── docker-compose.yml       # Docker setup for Postgres & RabbitMQ
├── package.json
└── README.md


🚀 Getting Started

Prerequisites

Node.js (v18 or higher recommended)

NPM or Yarn

Docker & Docker Compose

1. Installation & Setup

Clone the repository:

git clone [https://github.com/Zembrani/task-nest-app.git](https://github.com/Zembrani/task-nest-app.git)
cd task-nest-app


Install dependencies:

npm install


Start External Services:

docker-compose up -d


This starts PostgreSQL and RabbitMQ in the background.

PostgreSQL: Available at localhost:5432 (db: tasks, user: postgres, pass: tasknest)

RabbitMQ UI: Available at http://localhost:15672 (login: guest / guest)

2. Running the Application (Development)

You must run all three microservices simultaneously in separate terminals.

Terminal 1 (Start Auth Service):

npm run start:dev:auth


(Runs on http://localhost:3001)

Terminal 2 (Start Task Service):

npm run start:dev:task


(Runs on http://localhost:3000)

Terminal 3 (Start Notification Service):

npm run start:dev:notification


(Runs on http://localhost:3002 - check main.ts for port)

Wait for all three applications to show that they have successfully connected to the database and RabbitMQ.

3. End-to-End Test Flow

Register a User:

POST /auth/register (to http://localhost:3001)

Body: { "username": "testuser", "password": "password123" }

Log In:

POST /auth/login (to http://localhost:3001)

Body: { "username": "testuser", "password": "password123" }

Copy the access_token from the response.

Create a Task:

POST /tasks (to http://localhost:3000)

Header: Authorization: Bearer <your_access_token>

Body: { "title": "My First Task", "description": "Use my JWT!" }

Check the result: You will get a 201 Created response. In your notification-app terminal, you will see the task.created event log!

Try to Access Without Token:

GET /tasks (to http://localhost:3000)

Result: This will fail with a 401 Unauthorized error, as the AuthGuard is protecting the endpoint.

✅ Running Tests

Unit Tests

Run all unit tests for all applications and generate a coverage report:

npm run test:cov


(This uses the Jest config in package.json)

End-to-End (E2E) Tests

The E2E tests run against a separate test database (tasks_test) to ensure isolation.

npm run test:e2e


(This uses the jest-e2e.json config and runs all *.e2e-spec.ts files)

🔌 API Endpoints

Authentication Service (http://localhost:3001)

POST /auth/register (Public)

Body: { "username": "string", "password": "string" }

Returns: The newly created User object (excluding password).

POST /auth/login (Public)

Body: { "username": "string", "password": "string" }

Returns: { "access_token": "string" }

Task Service (http://localhost:3000)

All endpoints below are PROTECTED and require a valid JWT Authorization: Bearer <token> header.

GET /tasks: Get all tasks.

GET /tasks/:id: Get a single task by its UUID.

POST /tasks: Create a new task.

Body: { "title": "string", "description": "string" }

Triggers task.created event.

PUT /tasks/:id: Update an existing task.

Body: { "title"?: "string", "description"?: "string", "completed"?: boolean }

Triggers task.updated event.

DELETE /tasks/:id: Delete a task.

Returns 204 No Content on success.

Triggers task.deleted event.