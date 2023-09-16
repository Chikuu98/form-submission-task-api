import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FormDataController } from './formData.controller';
import { FormDataService } from './formData.service';
import { FormDataSchema } from './formData.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'FormData', schema: FormDataSchema }]),
  ],
  controllers: [FormDataController],
  providers: [FormDataService],
})
export class FormDataModule {}
