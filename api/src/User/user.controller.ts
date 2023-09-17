import { Controller, Body, Get, Patch, Delete, Request, Param, NotFoundException, Req } from '@nestjs/common';
import { Auth } from 'src/iam/authentication/decorators/auth.decorator';
import { AuthType } from 'src/iam/authentication/enums/auth-type.enums';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { logger } from 'src/SystemLogs/logs.service';

@Auth(AuthType.Bearer)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Delete()
  removeUser(
    @Request() req: any,
  ) {
    return this.userService.removeUser(req);
  }

  @Patch(':id')
  async updateUser(
    @Param('id') userId: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: any,
  ) {
    try {
      const updatedUser = await this.userService.updateUser(userId, updateUserDto, req);
      if (!updatedUser) {
        throw new NotFoundException(`User with id ${userId} not found`);
      }
      return updatedUser;
    }
    catch (error) {
      logger.log('error', 'class:UserController, method:updateUser', { trace: error });
      throw error;
    }
  }
}