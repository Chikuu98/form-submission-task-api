import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { Auth } from './decorators/auth.decorator';
import { RefreshTokenDto } from './dto/refresh-token.dto/refresh-token.dto';
import { SignInDto } from './dto/sign-in.dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto/sign-up.dto';
import { AuthType } from './enums/auth-type.enums';

@Auth(AuthType.None)
@Controller('authentication')
export class AuthenticationController {
    constructor(private readonly authService: AuthenticationService) { }

    @Post('register')
    signUp(
        @Body() signUpDto: SignUpDto
    ) {
        return this.authService.signUp(signUpDto);
    }

    @Post('login')
    signIn(
        @Body() signInDto: SignInDto
    ) {
        return this.authService.signIn(signInDto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('token-refresh')
    refreshTokens(
        @Body() refreshTokenDto: RefreshTokenDto
    ) {
        return this.authService.refreshTokens(refreshTokenDto);
    }
}
