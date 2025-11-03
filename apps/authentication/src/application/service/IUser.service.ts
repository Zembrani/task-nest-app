import { CreateUserDTO, FindUserDTO, User } from '../../domain/UserDomain';

export interface IUserService {
  logIn(payload: FindUserDTO): Promise<any>;
  createUser(payload: CreateUserDTO): Promise<User>;
}
