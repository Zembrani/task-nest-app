import { CreateUserResponseDTO, User } from '../../domain/UserDomain';

export interface IUserRepository {
  findByUsername(username: string): Promise<User | undefined>;
  createUser(
    username: string,
    password: string,
  ): Promise<CreateUserResponseDTO>;
}
