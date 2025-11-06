# 🚀 Task Management Microservices

> **A robust, event-driven backend system showcasing Nest.js, DDD, RabbitMQ, and JWT authentication**

[![Nest.js](https://img.shields.io/badge/nestjs-11.x-E0234E?style=flat&logo=nestjs)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/typescript-5.x-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![RabbitMQ](https://img.shields.io/badge/rabbitmq-latest-FF6600?style=flat&logo=rabbitmq)](https://www.rabbitmq.com/)
[![PostgreSQL](https://img.shields.io/badge/postgresql-latest-4169E1?style=flat&logo=postgresql)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/docker-compose-2496ED?style=flat&logo=docker)](https://www.docker.com/)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Concepts & Features](#-key-concepts--features)
- [Architecture Overview](#-architecture-overview)
- [Engineering Decisions](#-engineering-decisions--trade-offs)
- [Technologies](#-technologies-used)
- [Getting Started](#-getting-started)
- [API Endpoints](#-api-endpoints)
- [Testing](#-running-tests)
- [Future Improvements](#-future-improvements--next-steps)

---

## 🎯 Overview

This project demonstrates a **portfolio-ready** microservices architecture built on a Nest.js monorepo. It features three distinct microservices that communicate asynchronously using RabbitMQ, showcasing a full implementation of **Clean Architecture**, **Domain-Driven Design (DDD)** principles, and secure **JWT authentication**.

### The Three Services

<table>
<tr>
<td width="33%" align="center">

### 🛠️ task-app
**Resource Server**

Protected REST API for CRUD operations on Tasks

`Port: 3000`

</td>
<td width="33%" align="center">

### 🔔 notification-app
**Event Consumer**

Listens for task events and processes notifications

`Port: 3002`

</td>
<td width="33%" align="center">

### 🔐 authentication-app
**Auth Server**

Identity provider handling registration and JWT issuing

`Port: 3001`

</td>
</tr>
</table>

---

## ✨ Key Concepts & Features

### 🏗️ Microservices & Design

- **Microservices Architecture**: Three distinct Nest.js applications running independently
- **Clean Architecture**: Strict separation into Domain, Application, Infrastructure, and Presentation layers
- **Domain-Driven Design (DDD)**:
  - **Bounded Contexts**: Each microservice represents a distinct bounded context
  - **Entities & Aggregates**: Task and User as core domain entities
  - **Repositories**: Abstracting data persistence (`ITaskRepository`, `IUserRepository`)

### 🔒 Authentication & Authorization

- **JWT (JSON Web Token)**: Dedicated auth service for user registration and login
- **Password Hashing**: Secure bcrypt implementation
- **Guards**: Resource server protection using shared `AuthGuard` for JWT validation

### 📡 Event-Driven & Data

- **Event-Driven Communication**: RabbitMQ message broker for decoupled, asynchronous communication
- **Domain Events**: Type-safe event classes with metadata (`TaskCreatedEvent`, `TaskUpdatedEvent`)
- **Data Persistence**: TypeORM + PostgreSQL with separate table management per service

### 🧪 Tooling & Testing

- **API Validation**: Robust request validation using `class-validator` and Nest.js `ValidationPipe`
- **Comprehensive Testing**:
  - ✅ Unit Tests: Complete test suites with Jest and mocked dependencies
  - ✅ E2E Tests: Integration tests using Supertest against test database
- **Docker Compose**: Single-command setup for all external services
- **Monorepo Structure**: Shared code via `libs/shared` for DTOs, events, and guards

---

## 🏛️ Architecture Overview

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │         │                 │
│  🔐 Auth App    │         │  🛠️ Task App    │         │  🔔 Notif App   │
│  (Port 3001)    │         │  (Port 3000)    │         │  (Port 3002)    │
│                 │         │                 │         │                 │
│  • Register     │         │  • CRUD Tasks   │         │  • Consume      │
│  • Login        │◄────────│  • Validate JWT │         │    Events       │
│  • Issue JWT    │  Uses   │  • Publish      │────────►│  • Log/Notify   │
│                 │   JWT   │    Events       │  Events │                 │
└────────┬────────┘         └────────┬────────┘         └────────┬────────┘
         │                           │                           │
         │                           │                           │
         └───────────┬───────────────┴───────────┬───────────────┘
                     │                           │
                     ▼                           ▼
            ┌─────────────────┐        ┌─────────────────┐
            │   PostgreSQL    │        │    RabbitMQ     │
            │  (Port 5432)    │        │  (Port 5672)    │
            └─────────────────┘        └─────────────────┘
```

### 🔐 authentication-app (Port 3001)

- ✅ Public endpoints: `POST /auth/register` and `POST /auth/login`
- ✅ Password hashing with bcrypt
- ✅ Credential validation against `users` table
- ✅ JWT creation and signing with shared secret

### 🛠️ task-app (Port 3000)

- ✅ Protected endpoints requiring JWT authentication
- ✅ Shared `AuthGuard` for `Authorization: Bearer <token>` validation
- ✅ Business logic with proper error handling
- ✅ Data persistence to `tasks` table
- ✅ Event publishing to `task_exchange` in RabbitMQ

### 🔔 notification-app (Port 3002)

- ✅ No public API endpoints
- ✅ RabbitMQ connection on startup
- ✅ Event subscription from `task_exchange`
- ✅ Event logging (simulating notifications)

---

## 🧠 Engineering Decisions & Trade-offs

> **This project wasn't just built to work; it was engineered to demonstrate specific patterns for scalability, testability, and resilience.**

### 1️⃣ Architecture: Microservices vs. Monolith

| Aspect | Decision | Benefit | Trade-off |
|--------|----------|---------|-----------|
| **Pattern** | Microservice architecture with separate bounded contexts | Independent development, deployment, and scaling; isolated failure domains | Increased operational complexity, network latency, eventual consistency |

**Example**: If `notification-app` experiences high load, it can be scaled independently without affecting `task-app`.

---

### 2️⃣ Communication: Asynchronous (RabbitMQ) vs. Synchronous (HTTP/gRPC)

| Aspect | Decision | Benefit | Trade-off |
|--------|----------|---------|-----------|
| **Pattern** | Event-driven, asynchronous via RabbitMQ | High resilience, decoupling, zero data loss, low latency | Eventual consistency, message ordering complexity |

**Example**: Creating a task returns `201 Created` immediately. The notification is processed asynchronously, ensuring the user isn't blocked.

---

### 3️⃣ Design Pattern: Clean Architecture & DDD

| Aspect | Decision | Benefit | Trade-off |
|--------|----------|---------|-----------|
| **Pattern** | Clean Architecture with domain isolation | Framework-agnostic core, highly testable, portable | More boilerplate, steeper learning curve |

**Example**: The `Task` entity has zero dependencies on Nest.js or TypeORM—we could swap frameworks with minimal changes to business logic.

---

### 4️⃣ Security: Dedicated authentication-app

| Aspect | Decision | Benefit | Trade-off |
|--------|----------|---------|-----------|
| **Pattern** | Centralized Identity Provider (IdP) | Single source of truth for identity, easy to add new services, auth method flexibility | Additional service to maintain |

**Example**: The `task-app` doesn't care how authentication happens—it only validates the JWT from a trusted issuer.

---

## 🛠️ Technologies Used

<table>
<tr>
<td width="50%">

**Core Framework**
- Nest.js `^11.x`
- TypeScript `^5.x`

**Database & ORM**
- PostgreSQL (Docker)
- TypeORM `^0.3.x`

**Messaging**
- RabbitMQ (Docker)
- `@golevelup/nestjs-rabbitmq`

</td>
<td width="50%">

**Authentication**
- JWT (`@nestjs/jwt`)
- bcrypt

**Validation**
- class-validator
- class-transformer

**Testing**
- Jest `^30.x`
- Supertest

**Containerization**
- Docker
- Docker Compose

</td>
</tr>
</table>

---

## 🗂️ Project Structure

```
task-nest-app/
├── apps/
│   ├── task-app/              # 🛠️ Task Management (Resource Server)
│   ├── notification-app/      # 🔔 Notification Consumer
│   └── authentication-app/    # 🔐 Authentication (Auth Server)
│
├── libs/
│   └── shared/                # 📦 Shared Code
│       └── src/
│           ├── constants/     # jwtConstants.ts
│           ├── domain/        # TaskDomain.ts, UserDomain.ts
│           ├── events/        # event.constants.ts, task.events.ts
│           └── guards/        # auth.guard.ts
│
├── docker-compose.yml         # 🐳 Docker setup
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- ✅ Node.js (v18 or higher)
- ✅ NPM or Yarn
- ✅ Docker & Docker Compose

---

### 1️⃣ Installation & Setup

**Clone the repository:**

```bash
git clone https://github.com/Zembrani/task-nest-app.git
cd task-nest-app
```

**Install dependencies:**

```bash
npm install
```

**Start External Services:**

```bash
docker-compose up -d
```

> **Note**: This starts PostgreSQL and RabbitMQ in the background.

| Service | URL | Credentials |
|---------|-----|-------------|
| PostgreSQL | `localhost:5432` | db: `tasks`, user: `postgres`, pass: `tasknest` |
| RabbitMQ UI | `http://localhost:15672` | user: `guest`, pass: `guest` |

---

### 2️⃣ Running the Application (Development)

> **Important**: Run all three microservices simultaneously in separate terminals.

**Terminal 1 - Auth Service:**

```bash
npm run start:dev:auth
```

🌐 Runs on `http://localhost:3001`

---

**Terminal 2 - Task Service:**

```bash
npm run start:dev:task
```

🌐 Runs on `http://localhost:3000`

---

**Terminal 3 - Notification Service:**

```bash
npm run start:dev:notification
```

🌐 Runs on `http://localhost:3002`

---

Wait for all three applications to show successful connections to the database and RabbitMQ.

---

### 3️⃣ End-to-End Test Flow

#### Step 1: Register a User

```bash
POST http://localhost:3001/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "password": "password123"
}
```

---

#### Step 2: Log In

```bash
POST http://localhost:3001/auth/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "password123"
}
```

📋 Copy the `access_token` from the response.

---

#### Step 3: Create a Task

```bash
POST http://localhost:3000/tasks
Authorization: Bearer <your_access_token>
Content-Type: application/json

{
  "title": "My First Task",
  "description": "Use my JWT!"
}
```

✅ **Result**: You'll get a `201 Created` response, and the `notification-app` terminal will log the `task.created` event!

---

#### Step 4: Try Without Token

```bash
GET http://localhost:3000/tasks
```

❌ **Result**: `401 Unauthorized` error

---

## ✅ Running Tests

### Unit Tests

Run all unit tests and generate coverage report:

```bash
npm run test:cov
```

### End-to-End (E2E) Tests

E2E tests run against a separate test database (`tasks_test`) for isolation:

```bash
npm run test:e2e
```

---

## 📌 API Endpoints

### 🔐 Authentication Service (`http://localhost:3001`)

#### `POST /auth/register` 🌐 Public

**Request:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:** User object (excluding password)

---

#### `POST /auth/login` 🌐 Public

**Request:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "access_token": "string"
}
```

---

### 🛠️ Task Service (`http://localhost:3000`)

> **🔒 Protected**: All endpoints require `Authorization: Bearer <token>` header

| Method | Endpoint | Description | Event Triggered |
|--------|----------|-------------|-----------------|
| `GET` | `/tasks` | Get all tasks | - |
| `GET` | `/tasks/:id` | Get single task by UUID | - |
| `POST` | `/tasks` | Create new task | `task.created` |
| `PUT` | `/tasks/:id` | Update existing task | `task.updated` |
| `DELETE` | `/tasks/:id` | Delete task | `task.deleted` |

#### `POST /tasks` Request Body:
```json
{
  "title": "string",
  "description": "string"
}
```

#### `PUT /tasks/:id` Request Body:
```json
{
  "title": "string",      // optional
  "description": "string", // optional
  "completed": boolean     // optional
}
```

---

## 🌱 Future Improvements & Next Steps

This project provides a solid foundation. Here are the clear next steps for a production-grade system:

### 1️⃣ Observability: Distributed Tracing

**Problem**: How do we debug when an event notification never arrives?

**Solution**: Implement distributed tracing (e.g., OpenTelemetry, Jaeger) to track requests across all microservices.

---

### 2️⃣ Resilience: Dead Letter Queues (DLQ)

**Problem**: What happens when `notification-app` fails due to a "poison pill" message?

**Solution**: Configure Dead Letter Queues in RabbitMQ to capture failed messages for manual inspection and retry.

---

### 3️⃣ Infrastructure: API Gateway

**Problem**: Clients need to know the URLs of multiple services.

**Solution**: Introduce an API Gateway (e.g., Kong, AWS API Gateway) as a single entry point for the entire system.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👤 Author

**Zembrani**

- GitHub: [@Zembrani](https://github.com/Zembrani)
- Repository: [task-nest-app](https://github.com/Zembrani/task-nest-app)

---

<div align="center">

**⭐ If you found this project helpful, please consider giving it a star!**

Made with ❤️ using Nest.js, TypeScript, and a lot of ☕

</div>