import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { IUserRepository } from '../repository/IUserRepository';
import { IUserService } from './IUser.service';
import { CreateUserDTO, FindUserDTO } from '../../domain/UserDomain';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
    private jwtService: JwtService,
  ) {}

  async logIn(payload: FindUserDTO): Promise<{ access_token: string }> {
    const { username, password } = payload;

    const user = await this.userRepository.findByUsernameAndPassword(username);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const payloadToken = { username: user.username, sub: user.id };

    return {
      access_token: await this.jwtService.signAsync(payloadToken),
    };
  }

  async createUser(payload: CreateUserDTO): Promise<any> {
    const { username, password } = payload;

    const salt = 10;
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await this.userRepository.createUser(username, hashedPassword);

    return user;
  }
}
