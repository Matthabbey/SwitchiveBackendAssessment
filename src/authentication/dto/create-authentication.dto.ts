import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateAuthenticationDto {
  @ApiProperty({ example: 'switchive@gmail.com' })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ example: 'Switch' })
  @IsString()
  readonly first_name: string;

  @ApiProperty({ example: 'Chive' })
  @IsString()
  readonly last_name: string;

  @ApiProperty({ example: 'Chive@123' })
  @IsStrongPassword()
  readonly password: string;
}

export class OtpDto {
  @ApiProperty({ example: 'vamp@gmail.com' })
  @IsEmail()
  @IsOptional()
  @Transform(({ value }) => value.toLowerCase())
  readonly email: string;

  @ApiProperty({ example: '8790' })
  @IsString()
  readonly otp: string;
}

export class LoginDTO {
  @ApiProperty({
    description: 'user unique email',
    example: 'switchive@gmail.com',
  })
  @IsEmail()
  @IsOptional()
  @Transform(({ value }) => value.toLowerCase()) // Convert to lowercase
  readonly email: string;

  @ApiProperty({ example: 'Swtich@123' })
  @IsString()
  readonly password: string;
}

export interface AuthPayload {
  id: string;
  email: string;
  verified: boolean;
}

export interface IOtpInstance {
  email: string;
  otp: string;
}
