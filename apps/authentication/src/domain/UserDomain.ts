import { IsDefined, IsString } from 'class-validator';

export class User {
  id: string;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export class FindUserDTO {
  @IsString()
  @IsDefined()
  username: string;
  @IsString()
  @IsDefined()
  password: string;
}

export class CreateUserDTO {
  @IsString()
  @IsDefined()
  username: string;
  @IsString()
  @IsDefined()
  password: string;
}

export class CreateUserResponseDTO {
  @IsString()
  @IsDefined()
  id: string;
  @IsString()
  @IsDefined()
  username: string;
  @IsString()
  @IsDefined()
  createdAt: Date;
  @IsString()
  @IsDefined()
  updatedAt: Date;
}
