// import fs from 'fs';
// eslint-disable-next-line @typescript-eslint/no-var-requires
import * as fs from 'fs';
import { compare, genSalt, hash } from 'bcryptjs';
import { JwtPayload, sign, verify } from 'jsonwebtoken';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { HttpException } from '@nestjs/common';
import { Code } from 'typeorm';
import { EmailTemplates } from './interface';
import * as https from 'https';
import { AuthPayload } from 'src/authentication/dto/create-authentication.dto';
// const http = require('https');
// const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { seaMailerClient: SeaMailerClient } = require('seamailer-nodejs');
// Generating of salt code

export class UtilService {
  constructor(private readonly configService: ConfigService) {}

  public async generateSalt() {
    return await genSalt();
  }

  public async generateOTP() {
    const _otp = Math.floor(1000 + Math.random() * 9000).toString();
    // Generate a random OTP (e.g., 4-digit number)
    return _otp;
  }

  public async generateForgotPasswordOTP() {
    const characters = '0123456789';
    let otp = '';
    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      otp += characters[randomIndex];
    }
    return otp;
  }

  public async generatePassword(plainTextPassword: string, salt: string) {
    return await hash(plainTextPassword, salt);
  }

  public async matchPassword(
    hashedPassword: string,
    plainTextPassword: string,
  ) {
    return await compare(plainTextPassword, hashedPassword);
  }

  public async generateSignature(payload: AuthPayload) {
    const [access_token, refresh_token] = await Promise.all([
      sign(payload, process.env.JWT_ACCESS_SECRET, {
        expiresIn: process.env.JWT_EXPIRY_PERIOD,
      }),
      sign(payload, process.env.JWT_REFRESH_SECRET, {
        expiresIn: process.env.JWT_REFRESH_SECRET_EXPIRY_PERIOD,
      }),
    ]);
    return {
      access_token,
      refresh_token,
    };
  }

  //Verifying the signature of the user before allowing login
  public async verifySignature(signature: string) {
    return verify(
      signature,
      process.env.JWT_ACCESS_SECRET,
    ) as unknown as JwtPayload;
  }

  public async validatePassword(
    enteredPassword: string,
    savedPassword: string,
    salt: string,
  ) {
    return (
      (await this.generatePassword(enteredPassword, salt)) === savedPassword
    );
  }

  public async sendSeaMailer(data: EmailTemplates) {
    try {
      await SeaMailerClient?.sendMail({
        templateId: data.templateId,
        templateLanguage: true,
        from: {
          name: new ConfigService().get('VampAI'),
          email: new ConfigService().get('EMAIL_SENDER'),
        },
        subject: data.subject,
        to: [
          {
            email: data.email,
            name: data.user,
          },
        ],
        variables: {
          name: data.user,
          code: data.code,
          link: data?.link,
        },
      });
      console.log('Sign Up Email sent successfully', data);
    } catch (error) {
      console.log(error);
    }
  }

  public async sendPhoneNumberOtpVerification(
    otp: string,
    toPhoneNumber: string,
  ) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const client = require('twilio')(
        process.env.TWILLO_ACCOUNT_ID,
        process.env.TWILLO_AUTH_TOKEN,
      );

      const response = await client.messages.create({
        body:
          process.env.USER_NAME +
          `: Your signup verificication OTP is: ${otp}..`,
        to: toPhoneNumber.replace(/^0/, '+234'),
        from: process.env.ADMIN_NUMBER,
      });
      return response;
    } catch (error) {
      console.log(error);
    }
  }
}
