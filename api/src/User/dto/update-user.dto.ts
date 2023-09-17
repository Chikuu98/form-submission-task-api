import { IsString, IsEmail, Min, Max } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;
}
