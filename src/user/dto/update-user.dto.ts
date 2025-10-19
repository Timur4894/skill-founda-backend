import { IsEmail, IsOptional, IsString, MinLength, IsArray } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    @MinLength(3)
    username?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    profilePicture?: string;

    @IsOptional()
    @IsString()
    bio?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    skills?: string[];
}