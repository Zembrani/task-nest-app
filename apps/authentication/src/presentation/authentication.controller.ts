import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Post } from '@nestjs/common';
import type { IUserService } from '../application/service/IUser.service';
import { CreateUserDTO, FindUserDTO, User } from '../domain/UserDomain';

@Controller('auth')
export class AuthenticationController {
  constructor(
    @Inject('IUserService') private readonly userService: IUserService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async LogIn(@Body() body: FindUserDTO): Promise<{ access_token: string }> {
    return this.userService.logIn(body);
  }

  @Post('register')
  async createUser(@Body() body: CreateUserDTO): Promise<User> {
    return this.userService.createUser(body);
  }
}
