import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { FormDataModule } from './FormData/formData.module';
import { UserModule } from './User/user.module';
import { IamModule } from './iam/iam.module';
require('dotenv').config();

@Module({
  imports: [
    UserModule,
    FormDataModule,
    IamModule,
    MongooseModule.forRoot(process.env.DB),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
