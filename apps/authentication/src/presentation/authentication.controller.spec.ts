import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationController } from './authentication.controller';
import { PostgresUserRepository } from '../infrastructure/repository/PostgresUserRepository';
import { Repository } from 'typeorm';
import { mock } from 'node:test';

const mockUserService = {
  logIn: jest.fn(),
  createUser: jest.fn(),
};

describe('AuthenticationController', () => {
  let authenticationController: AuthenticationController;

  const bodyDTO = {
    username: 'user_123',
    password: 'password_123',
  };

  const userDTO = {
    username: 'admin',
    password: 'hashed_password_123',
    id: '985ab780-3f5b-4a00-9186-abcde1234567',
    createdAt: '2025-11-06T13:53:44.574Z',
    updatedAt: '2025-11-06T13:53:44.574Z',
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthenticationController],
      providers: [
        {
          provide: 'IUserService',
          useValue: mockUserService,
        },
      ],
    }).compile();

    authenticationController = app.get<AuthenticationController>(
      AuthenticationController,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('root', () => {
    it('should be defined', () => {
      expect(authenticationController).toBeDefined();
    });

    it('LogIn should return access_token"', async () => {
      mockUserService.logIn.mockResolvedValue({
        access_token: 'some_jwt_token_123',
      });

      const result = await authenticationController.LogIn(bodyDTO);

      expect(result).toHaveProperty('access_token');
      expect(result.access_token).toEqual('some_jwt_token_123');
      expect(mockUserService.logIn).toHaveBeenCalledWith(bodyDTO);
    });
  });
});
