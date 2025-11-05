import { UserService } from './application/service/user.service';
import { Module } from '@nestjs/common';
import { AuthenticationController } from './presentation/authentication.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './infrastructure/database/users.entity';
import { PostgresUserRepository } from './infrastructure/repository/PostgresUserRepository';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './presentation/constants/jwtConstants';

@Module({
  controllers: [AuthenticationController],
  providers: [
    UserService,
    {
      provide: 'IUserService',
      useClass: UserService,
    },
    PostgresUserRepository,
    {
      provide: 'IUserRepository',
      useClass: PostgresUserRepository,
    },
  ],
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '30m' },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'tasknest',
      database: process.env.POSTGRES_DATABASE || 'tasks',
      synchronize: true,
      autoLoadEntities: true,
    }),
    TypeOrmModule.forFeature([UserEntity]),
  ],
})
export class AuthenticationModule {}
