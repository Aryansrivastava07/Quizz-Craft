export class RegisterAuthResponseDto {
      username!: string;
      email!: string;
      verified!: boolean;
}


export class LoginAuthResponseDto {
      username!: string;
      email!: string;
      verified!: boolean;
      profilePicture!: string;
}

export class MeAuthResponseDto {
      username!: string;
      email!: string;
      verified!: boolean;
      profilePicture!: string;
}
