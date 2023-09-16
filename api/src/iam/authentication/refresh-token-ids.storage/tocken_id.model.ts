import * as mongoose from 'mongoose';

export const TockenIdSchema = new mongoose.Schema({
  key: String,
  value: String,
});

export interface TockenId extends mongoose.Document {
  key: string;
  value: string;
}
