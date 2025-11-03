import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../database/users.entity';
import { Repository } from 'typeorm';
import { IUserRepository } from '../../application/repository/IUserRepository';
import { User } from '../../domain/UserDomain';

@Injectable()
export class PostgresUserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findByUsernameAndPassword(
    username: string,
    password: string,
  ): Promise<User | undefined> {
    const user = await this.userRepository.findOne({
      where: { username, password },
    });

    return user ? user : undefined;
  }

  async createUser(username: string, password: string): Promise<User> {
    const user = await this.userRepository.save({ username, password });

    return user;
  }
}
