import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import * as passport from 'passport';
import { PaginationInterceptor } from './pagination/pagination.interceptor';
import { PaginationService } from './pagination/pagination.service';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter, HttpExceptionFilter } from './middlewares';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  // app.enableCors();
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:8080',
      'http://localhost:8000',
      'https://www.example.com',
      'https://app.example.com',
    ],
    methods: ['GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS'],
    credentials: true,
  });
  // app.useGlobalGuards(new RolesGuard());
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('SWITCHIVE ASSESSMENT')
    .setDescription('API Descriptions')
    .setVersion('1.0')
    .addServer(`http://localhost:3000`)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  fs.writeFileSync('./swagger.json', JSON.stringify(document));
  SwaggerModule.setup('/', app, document);
  app.useGlobalInterceptors(
    new PaginationInterceptor(new PaginationService(), 'data'),
  );
  app.useGlobalPipes(new ValidationPipe());
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  app.useGlobalFilters(new HttpExceptionFilter()); //Register the custom exception filter
  passport.serializeUser(function (user, done) {
    done(null, user);
  });
  passport.deserializeUser(function (obj, done) {
    done(null, obj);
  });
  // app.setGlobalPrefix('api/v1');
  app.use(passport.initialize());
  // await dataSource.initialize();
  // await dataSource.runMigrations();
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
