import * as mongoose from 'mongoose';

export const FormDataSchema = new mongoose.Schema({
  itemName: String,
  title: String,
  category: String,
  imageNames: [String],
});

export interface FormData extends mongoose.Document {
  itemName: string;
  title: string;
  category: string;
  imageNames: string[];
}
