import { Body, Controller, Get, Inject, Param, Post, UseGuards } from '@nestjs/common';
import type { IUserService } from '../application/service/IUser.service';
import { CreateUserDTO, FindUserDTO, User } from '../domain/UserDomain';
import { AuthGuard } from './guards/auth.guard';

@Controller('users')
export class AuthenticationController {
  constructor(
    @Inject('IUserService') private readonly userService: IUserService,
  ) {}

  @Get(':username/:password')
  async LogIn(@Param() param: FindUserDTO): Promise<{ access_token: string }> {
    return this.userService.logIn(param);
  }

  @UseGuards(AuthGuard)
  @Post()
  async createUser(@Body() body: CreateUserDTO): Promise<User> {
    return this.userService.createUser(body);
  }
}
