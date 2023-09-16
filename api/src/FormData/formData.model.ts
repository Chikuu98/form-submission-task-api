import * as mongoose from 'mongoose';

export const FormDataSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  phoneNumber: String,
  country: String,
  imageNames: [String],
});

export interface FormData extends mongoose.Document {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  country: string;
  imageNames: string[];
}
