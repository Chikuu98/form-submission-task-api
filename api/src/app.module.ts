import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { FormDataModule } from './FormData/formData.module';

@Module({
  imports: [
    UserModule,
    FormDataModule,
    MongooseModule.forRoot('mongodb+srv://chikudev:chikudev@cluster0.udpe0iy.mongodb.net/test?retryWrites=true&w=majority'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
