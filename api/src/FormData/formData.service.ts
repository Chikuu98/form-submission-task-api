import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { FormData } from './formData.model';

@Injectable()
export class FormDataService {
  constructor(@InjectModel('FormData') private readonly formDataModel: Model<FormData>) {}

  async create(data: FormData): Promise<FormData> {
    const createdForm = new this.formDataModel(data);
    return createdForm.save();
  }

  async findAll(): Promise<FormData[]> {
    return this.formDataModel.find().exec();
  }
}
