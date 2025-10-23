import { Injectable } from '@nestjs/common';
import { Task } from 'src/domain/TaskDomain';

export class BaseEvent {
  public readonly id: string;
  public readonly timestamp;
  public readonly actor: { userId: string };

  constructor(actorId: string = 'admin') {
    this.id = crypto.randomUUID();
    this.timestamp = new Date();
    this.actor = { userId: actorId };
  }
}

export class TaskCreatedEvent extends BaseEvent {
  constructor(
    public readonly data: Task,
    actorId?: string,
  ) {
    super(actorId);
  }
}

export class TaskUpdatedEvent extends BaseEvent {
  constructor(
    public readonly data: { before: Task; after: Task },
    actorId?: string,
  ) {
    super(actorId);
  }
}

export class TaskDeletedEvent extends BaseEvent {
  constructor(
    public readonly data: { id: string },
    actorId?: string,
  ) {
    super(actorId);
  }
}
