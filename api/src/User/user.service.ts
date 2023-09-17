import { BadRequestException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.model';
import { logger } from 'src/SystemLogs/logs.service';

@Injectable()
export class UserService {
    constructor(
        @InjectModel('User') private readonly userModel: Model<User>
    ) { }

    async findAll(): Promise<User[]> {
        try{
            return this.userModel.find().exec();
        }
        catch(error){
            logger.log('error', 'class:UserService, method:findAll', { trace: error });
            throw error;
        }
    }

    async removeUser(req: any) {
        try {
            const _id = req.user.sub;
            const deleted_user = this.userModel.findOneAndDelete({ _id }).exec();
            if (deleted_user) {
                return `User with _id ${_id} has been deleted.`;
            }
            else {
                return `User with _id ${_id} not found`;
            }
        }
        catch (error) {
            logger.log('error', 'class:UserService, method:removeUser', { trace: error });
            throw error;
        }
    }

    async updateUser(userId: string, attrs: Partial<User>, req: any): Promise<User | null> {
        try {
            const _id = req.user.sub;
            if (_id != userId) throw new BadRequestException('You cannot update this user');

            const user = await this.userModel.findById(userId).exec();
            if (!user) {
                return null;
            }

            Object.assign(user, attrs);

            await user.save();
            return user;
        }
        catch (error) {
            logger.log('error', 'class:UserService, method:updateUser', { trace: error });
            throw error;
        }
    }
}
