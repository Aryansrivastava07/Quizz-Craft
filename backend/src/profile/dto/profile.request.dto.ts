import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class getProfileDto {
    @IsEmail()
    @IsNotEmpty()
    email!: string;
}

export class uploadAvatarDto {
    file!: File;
}

export class updateProfileDto {
    @IsEmail()
    @IsNotEmpty()
    email!: string;
}

