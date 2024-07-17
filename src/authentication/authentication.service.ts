import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateAuthenticationDto,
  IOtpInstance,
  LoginDTO,
} from './dto/create-authentication.dto';
import { UpdateAuthenticationDto } from './dto/update-authentication.dto';
import { Users } from '../users/entities';
import { compare } from 'bcryptjs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UtilService } from '../utilities';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    private readonly utilityService: UtilService,
  ) {}

  async signUp(signupInstance: CreateAuthenticationDto) {
    const _salt = await this.utilityService.generateSalt();
    const _otp = await this.utilityService.generateOTP();
    const userPassword = await this.utilityService.generatePassword(
      signupInstance.password,
      _salt,
    );
    try {
      // Check if there is an existing user with the credentials supplied
      const existingUser = await this.userRepository.findOne({
        where: { email: signupInstance.email },
      });
      if (existingUser) {
        throw new NotFoundException('User already exist');
      }
      //Creating a new user instance
      const user = new Users();
      user.email = signupInstance.email;
      user.password = userPassword;
      user.first_name = signupInstance.first_name;
      user.last_name = signupInstance.last_name;
      user.user_otp = _otp;

      const saved_user = await this.userRepository.save(user);
      const { id, password, user_otp, ...data } = saved_user;
      const welcomeEmailData = {
        email: signupInstance.email,
        user: user.first_name,
        templateId: 7882,
        subject: 'Welcome',
      };
      await this.utilityService.sendSeaMailer(welcomeEmailData);
      const emailData = {
        email: signupInstance.email,
        user: user.first_name,
        templateId: 9228,
        subject: 'Email Verification',
        code: _otp,
      };
      await this.utilityService.sendSeaMailer(emailData);
      return data;
    } catch (error) {
      console.log(error);
      throw new HttpException(error.response, error.status);
    }
  }

  async accountOtpVerification(token: IOtpInstance): Promise<unknown> {
    let tokens;
    try {
      const _user = await this.userRepository.findOne({
        where: {
          email: token.email,
          user_otp: token.otp,
        },
      });

      if (!_user) {
        throw new NotFoundException('User not found');
      }

      if (token.otp !== _user.user_otp) {
        throw new BadRequestException('Wrong or invalid OTP');
      }
      // checking if user's email or phone_number is verified
      if (_user.is_email_verified) {
        throw new BadRequestException('Account has been verified already');
      }
      //If user's email or phone_number is not verified, set the false to true and save 8681002572
      if (!_user.is_email_verified) {
        _user.is_email_verified = true;
        await this.userRepository.save(_user);
      }

      tokens = await this.utilityService.generateSignature({
        id: _user.id,
        email: _user.email,
        verified: _user.is_email_verified,
      });
      const { id, password, user_otp, ...user } = _user;
      return {
        tokens,
        user,
      };
    } catch (error) {
      console.log('auth/verify', error);
      throw new HttpException(error.response, error.status, error.error);
    }
  }

  async login(loginInstance: LoginDTO) {
    try {
      let tokens: any;
      const _user = await this.userRepository.findOne({
        where: {
          email: loginInstance.email,
        },
      });
      if (!_user) {
        throw new NotFoundException('User not found');
      }

      if (!_user?.is_email_verified) {
        throw new BadRequestException('Account has not been verified');
      }

      // eslint-disable-next-line prettier/prettier
      if (!_user || !_user == (await compare(loginInstance.password, _user.password))) {
        throw new BadRequestException('Invalid credentials');
      }

      // eslint-disable-next-line prefer-const
      tokens = await this.utilityService.generateSignature({
        id: _user.id,
        email: _user.email,
        verified: _user.is_email_verified,
      });
      const { id, password, ...user } = _user;
      return {
        tokens,
        user,
      };
    } catch (error) {
      console.log('auth/login', error);
      throw new HttpException(error.response, error.status, error.error);
    }
  }

  async profile(req: any): Promise<Users> {
    try {
      const userId = req.user.userId;
      const user = await this.userRepository.findOne({
        where: {
          id: userId,
        },
      });
      return user;
    } catch (error) {
      console.log('profile', error);
      throw new HttpException(error.response, error.status, error.error);
    }
  }
}
