import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { TockenId } from "./tocken_id.model";
import { logger } from "src/SystemLogs/logs.service";

export class InvalidatedRefreshTokenError extends Error { }
@Injectable()
export class RefreshTokenIdsStorage {
   constructor(
      @InjectModel('TockenId') private readonly tockenIdModel: Model<TockenId>
   ) { }

   async insert(userId: number, tokenId: string): Promise<void> {
      try {
         const existing = await this.tockenIdModel.findOne({ key: this.getKey(userId) }).exec();
         if (existing) {
            existing.value = tokenId;
            await existing.save();
         }
         else {
            const new_key = new this.tockenIdModel();
            new_key.key = this.getKey(userId);
            new_key.value = tokenId;
            await new_key.save();
         }
      }
      catch (error) {
         logger.log('error', 'class:RefreshTokenIdsStorage, method:insert', { trace: error });
         throw error;
      }
   }

   async validate(userId: number, tokenId: string): Promise<boolean> {
      try {
         const stored = await this.tockenIdModel.findOne({ key: this.getKey(userId) });
         const storedId = stored.value;
         if (storedId !== tokenId) {
            throw new InvalidatedRefreshTokenError();
         }
         return storedId === tokenId;
      }
      catch (error) {
         logger.log('error', 'class:RefreshTokenIdsStorage, method:validate', { trace: error });
         throw error;
      }
   }

   async invalidate(userId: number): Promise<void> {
      try{
         await this.tockenIdModel.deleteOne({ key: this.getKey(userId) });
      }
      catch(error){
         logger.log('error', 'class:RefreshTokenIdsStorage, method:invalidate', { trace: error });
         throw error; 
      }
   }

   private getKey(userId: number): string {
      return `${userId}`;
   }
}
