import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { FormData } from './formData.model';

@Injectable()
export class FormDataService {
  constructor(@InjectModel('FormData') private readonly formDataModel: Model<FormData>) { }

  async create(data: FormData): Promise<FormData> {
    const createdForm = new this.formDataModel(data);
    return createdForm.save();
  }

  async findAll(): Promise<FormData[]> {
    return this.formDataModel.find().exec();
  }

  async updateItem(itemId: string, attrs: Partial<FormData>): Promise<FormData | null> {
    try {
      const item = await this.formDataModel.findById(itemId).exec();
      if (!item) {
        return null;
      }
      Object.assign(item, attrs);
      await item.save();
      return item;
    }
    catch (error) {
      throw error;
    }
  }

  async removeItem(itemId: any) {
    try {
      const deleted_item = this.formDataModel.findOneAndDelete({ itemId }).exec();
      if (deleted_item) {
        return `User with _id ${itemId} has been deleted.`;
      }
      else {
        return `User with _id ${itemId} not found`;
      }
    }
    catch (error) {
      throw `Error deleting user: ${error}`;
    }
  }
}
