import { CreateUserDTO, FindUserDTO, User } from '../../domain/UserDomain';

export interface IUserService {
  logIn(payload: FindUserDTO): Promise<{ access_token: string }>;
  createUser(payload: CreateUserDTO): Promise<User>;
}
