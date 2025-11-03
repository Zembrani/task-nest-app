import { User } from '../../domain/UserDomain';

export interface IUserRepository {
  findByUsernameAndPassword(
    username: string,
    password: string,
  ): Promise<User | undefined>;
  createUser(username: string, password: string): Promise<User>;
}
