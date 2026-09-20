import { RegisterAuthResponseDto, LoginAuthResponseDto, MeAuthResponseDto } from "../dto/auth.response.dto";
export interface LoginResponseData {
    user: LoginAuthResponseDto;
    accessToken: string;
    refreshToken: string;
}
export interface RegisterResponseData {
    user: RegisterAuthResponseDto;
}

export interface MeResponseData {
    user: MeAuthResponseDto;
}

export interface RefreshAuthData {
    refreshToken: String;
    accessToken: String;
}