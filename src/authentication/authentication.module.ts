import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../users/entities';
import { JwtModule } from '@nestjs/jwt';
import { UtilService } from '../utilities';
import { AccessTokenStrategy } from '../middlewares';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRY_PERIOD },
    }),
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, UtilService, AccessTokenStrategy],
})
export class AuthenticationModule {}
