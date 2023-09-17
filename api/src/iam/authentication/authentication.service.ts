import { ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import jwtConfig from '../config/jwt.config';
import { HashingService } from '../hashing/hashing.service';
import { ActiveUserData } from '../interfaces/active-user-interface';
import { RefreshTokenDto } from './dto/refresh-token.dto/refresh-token.dto';
import { SignInDto } from './dto/sign-in.dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto/sign-up.dto';
import { InvalidatedRefreshTokenError, RefreshTokenIdsStorage } from './refresh-token-ids.storage/refresh-token-ids.storage';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/User/user.model';
import { logger } from 'src/SystemLogs/logs.service';
import { AuthenticationEnums } from './enums/authentication.enum';


@Injectable()
export class AuthenticationService {
    constructor(
        private readonly hashingService: HashingService,
        private readonly jwtService: JwtService,
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
        private readonly refreshTokenIdsStorage: RefreshTokenIdsStorage,
        @InjectModel('User') private readonly userModel: Model<User>
    ) { }

    async signUp(signUpDto: SignUpDto) {
        try {
            const user = new this.userModel();

            user.email = signUpDto.email;
            user.password = await this.hashingService.hash(signUpDto.password);
            user.name = signUpDto.name;

            await user.save();
            return (AuthenticationEnums.REGISTRATION_SUCCESS);
        } catch (error) {
            logger.log('error', 'class:AuthenticationService, method:signUp', { trace: error });
            const uniqueViolationErrorCode = AuthenticationEnums.ER_DUP_ENTRY;
            if (error.code === uniqueViolationErrorCode) {
                throw new ConflictException();
            }
            else {
                throw error;
            }
        }
    }

    async signIn(signInDto: SignInDto) {
        try {
            const user = await this.userModel.findOne({
                email: signInDto.email,
            }).exec();
            if (!user) {
                throw new UnauthorizedException(AuthenticationEnums.USER_NOT_FOUND);
            }
            const IsMatch = await this.hashingService.compare(
                signInDto.password,
                user.password
            );
            if (!IsMatch) {
                throw new UnauthorizedException(AuthenticationEnums.PASSWORD_MISS_MATCH);
            }
            return await this.generateTokens(user);
        }
        catch (error) {
            logger.log('error', 'class:AuthenticationService, method:signIn', { trace: error });
            throw error;
        }
    }

    async generateTokens(user: any) {
        try {
            const refreshTokenId = randomUUID();
            const [accessToken, refreshToken] = await Promise.all([
                this.signToken<Partial<ActiveUserData>>(
                    user.id,
                    this.jwtConfiguration.accessTokenTtl,
                    { email: user.email }
                ),
                this.signToken(user.id, this.jwtConfiguration.refreshTokenTtl, {
                    refreshTokenId
                })
            ]);

            await this.refreshTokenIdsStorage.insert(user.id, refreshTokenId);
            return {
                accessToken,
                refreshToken,
                id: user.id,
                name: (user.name) ? user.name : user.user_name
            };
        }
        catch (error) {
            logger.log('error', 'class:AuthenticationService, method:generateTokens', { trace: error });
            throw error;
        }
    }

    async refreshTokens(refreshTokenDto: RefreshTokenDto) {
        try {
            const { sub, refreshTokenId } = await this.jwtService.verifyAsync<
                Pick<ActiveUserData, 'sub'> & { refreshTokenId: string }
            >(
                refreshTokenDto.refreshToken, {
                secret: this.jwtConfiguration.secret,
                audience: this.jwtConfiguration.audience,
                issuer: this.jwtConfiguration.issuer,
            }
            );
            const user = await this.userModel.findOne({
                _id: sub,
            });
            const isValid = await this.refreshTokenIdsStorage.validate(
                user.id,
                refreshTokenId
            );
            if (isValid) {
                await this.refreshTokenIdsStorage.invalidate(user.id);
            } else {
                throw new Error(AuthenticationEnums.INVALID_REFRESH_TOKEN);
            }
            return this.generateTokens(user);
        }
        catch (error) {
            logger.log('error', 'class:AuthenticationService, method:refreshTokens', { trace: error });
            if (error instanceof InvalidatedRefreshTokenError) {
                throw new UnauthorizedException(AuthenticationEnums.ACCESS_DENIED);
            }
            throw new UnauthorizedException();
        }
    }

    async signToken<T>(userId: number, expiresIn: number, payload?: T) {
        try {
            return await this.jwtService.signAsync(
                {
                    sub: userId,
                    ...payload,
                },
                {
                    audience: this.jwtConfiguration.audience,
                    issuer: this.jwtConfiguration.issuer,
                    secret: this.jwtConfiguration.secret,
                    expiresIn,
                }
            );
        }
        catch (error) {
            logger.log('error', 'class:AuthenticationService, method:signToken', { trace: error });
            throw error;
        }
    }
}
