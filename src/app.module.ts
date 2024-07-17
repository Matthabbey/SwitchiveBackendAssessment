import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthenticationModule } from './authentication/authentication.module';
import { ProductsModule } from './products/products.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './config';
import { Users } from './users/entities';
import { ProductsController } from './products/products.controller';
import { AuthenticationService } from './authentication/authentication.service';
import { ProductsService } from './products/products.service';
import { AuthenticationController } from './authentication/authentication.controller';
import { UtilService } from './utilities';
import { APP_FILTER } from '@nestjs/core';
import {
  AllExceptionsFilter,
  HttpExceptionFilter,
  LoggerMiddleware,
} from './middlewares';
import { Products } from './products/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Products]),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(dataSourceOptions),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      global: true,
      secret: new ConfigService().get('JWT_ACCESS_SECRET'),
      signOptions: { expiresIn: new ConfigService().get('JWT_EXPIRY_PERIOD') },
    }),
    AuthenticationModule,
    ProductsModule,
    AppModule,
  ],
  controllers: [AuthenticationController, ProductsController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    UtilService,
    AuthenticationService,
    ProductsService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
