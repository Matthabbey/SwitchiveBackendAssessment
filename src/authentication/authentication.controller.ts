import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseFilters,
  UsePipes,
  ValidationPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import {
  CreateAuthenticationDto,
  LoginDTO,
  OtpDto,
} from './dto/create-authentication.dto';
import {
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AccessTokenGuard, AllExceptionsFilter } from 'src/middlewares';

@ApiTags('Auth')
@Controller('auth')
@UseFilters(AllExceptionsFilter) //Here
@UsePipes(new ValidationPipe())
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @ApiOkResponse({ description: 'successful' })
  @ApiUnauthorizedResponse({ description: 'unauthorized user' })
  @ApiBadRequestResponse({ description: 'bad request' })
  @ApiCreatedResponse({ description: 'account successfully created' })
  @Post('signup')
  create(@Body() createAuthenticationDto: CreateAuthenticationDto) {
    return this.authenticationService.signUp(createAuthenticationDto);
  }

  @ApiOkResponse({ description: 'successful' })
  @ApiUnauthorizedResponse({ description: 'unauthorized user' })
  @ApiBadRequestResponse({ description: 'bad request' })
  @ApiCreatedResponse({ description: 'account successfully created' })
  @ApiCreatedResponse({ description: 'email verification successful' })
  @Post('account/verification')
  async verifyEmail(@Body() otp: OtpDto) {
    return await this.authenticationService.accountOtpVerification(otp);
  }

  @ApiOkResponse({ description: 'successful' })
  @ApiUnauthorizedResponse({ description: 'unauthorized user' })
  @ApiBadRequestResponse({ description: 'bad request' })
  @ApiCreatedResponse({ description: 'account login successfully' })
  @Post('login')
  findOne(@Body() loginDto: LoginDTO) {
    return this.authenticationService.login(loginDto);
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @ApiOkResponse({ description: 'successful' })
  @ApiUnauthorizedResponse({ description: 'unauthorized user' })
  @ApiBadRequestResponse({ description: 'bad request' })
  @ApiCreatedResponse({ description: 'account login successfully' })
  @Get('profile')
  userProfile(@Req() req: Request) {
    return this.authenticationService.profile(req);
  }
}
