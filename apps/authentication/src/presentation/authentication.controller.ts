import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import type { IUserService } from '../application/service/IUser.service';
import { CreateUserDTO, FindUserDTO, User } from '../domain/UserDomain';

@Controller('users')
export class AuthenticationController {
  constructor(
    @Inject('IUserService') private readonly userService: IUserService,
  ) {}

  @Get(':username/:password')
  async LogIn(@Param() param: FindUserDTO): Promise<User> {
    return this.userService.logIn(param);
  }

  @Post()
  async createUser(@Body() body: CreateUserDTO): Promise<User> {
    return this.userService.createUser(body);
  }
}
