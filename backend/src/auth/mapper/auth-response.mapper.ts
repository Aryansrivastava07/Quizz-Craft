import { User } from "../../schemas/user.schema";
import { LoginAuthResponseDto, RegisterAuthResponseDto, MeAuthResponseDto } from "../dto/auth-response.dto";

export const toLoginDto = (user: User): LoginAuthResponseDto => ({
    username: user.username,
    email: user.email,
    verified: user.verified,
    profilePicture: user.profilePicture,
});

export const toRegisterDto = (user: User): RegisterAuthResponseDto => ({
    username: user.username,
    email: user.email,
    verified: user.verified,
});

export const toMeDto = (user: User): MeAuthResponseDto => ({
    username: user.username,
    email: user.email,
    verified: user.verified,
    profilePicture: user.profilePicture,
})