import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateAuthDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  username: string;
  

  @IsString()
  @MinLength(6)
  password: string;
}
