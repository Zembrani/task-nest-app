import { CreateUserResponseDTO, User } from '../../domain/UserDomain';

export interface IUserRepository {
  findByUsernameAndPassword(username: string): Promise<User | undefined>;
  createUser(
    username: string,
    password: string,
  ): Promise<CreateUserResponseDTO>;
}
