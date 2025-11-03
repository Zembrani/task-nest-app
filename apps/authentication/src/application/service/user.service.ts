import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IUserRepository } from '../repository/IUserRepository';
import { IUserService } from './IUser.service';
import { CreateUserDTO, FindUserDTO } from '../../domain/UserDomain';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
  ) {}

  async logIn(payload: FindUserDTO): Promise<any> {
    const { username, password } = payload;

    const user = await this.userRepository.findByUsernameAndPassword(
      username,
      password,
    );

    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return user;
  }

  async createUser(payload: CreateUserDTO): Promise<any> {
    const { username, password } = payload;

    const user = await this.userRepository.createUser(username, password);
    return user;
  }
}
