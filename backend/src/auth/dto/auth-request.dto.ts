import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class LoginAuthDto {
      @IsEmail()
      @IsNotEmpty()
      email!: string;

      @IsNotEmpty()
      password!: string;
}

export class RegisterAuthDto {
      @IsString()
      @IsNotEmpty()
      username!: string;

      @IsEmail()
      @IsNotEmpty()
      email!: string;

      @IsNotEmpty()
      @IsStrongPassword()
      password!: string;
}

export class LogoutAuthDto {
      @IsNotEmpty()
      userId!: string;

      @IsNotEmpty()
      refreshToken!: string
}

export class MeAuthDto {
      @IsNotEmpty()
      userId!: string;
}

export class RefreshAuthDto {
      @IsNotEmpty()
      refreshToken!: string
}