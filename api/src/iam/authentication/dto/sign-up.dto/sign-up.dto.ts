import { IsEmail, IsString, MinLength } from "class-validator";

export class SignUpDto {

    @IsEmail()
    email: string;

    @IsString()
    name: string;

    @MinLength(10)
    password: string;
}
