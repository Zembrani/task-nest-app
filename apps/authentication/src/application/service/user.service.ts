import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { IUserRepository } from '../repository/IUserRepository';
import { IUserService } from './IUser.service';
import { CreateUserDTO, FindUserDTO } from '../../domain/UserDomain';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    private jwtService: JwtService
  ) {}

  async logIn(payload: FindUserDTO): Promise<{ access_token: string }> {
    const { username, password } = payload;

    const user = await this.userRepository.findByUsernameAndPassword(
      username,
      password,
    );

    if (!user) {
      throw new UnauthorizedException('User not found.');
    }
    const payloadToken = { username: user.username, sub: user.id };

    return {
      access_token: await this.jwtService.signAsync(payloadToken),
    };
  }

  async createUser(payload: CreateUserDTO): Promise<any> {
    const { username, password } = payload;

    const user = await this.userRepository.createUser(username, password);
    return user;
  }
}
