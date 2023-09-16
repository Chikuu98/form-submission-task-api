import { Injectable} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { TockenId } from "./tocken_id.model";

export class InvalidatedRefreshTokenError extends Error {}
@Injectable()
export class RefreshTokenIdsStorage
{
   constructor(
      @InjectModel('TockenId') private readonly tockenIdModel: Model<TockenId>
    ) { }

 async insert(userId: number, tokenId: string): Promise<void> {
   const existing = await this.tockenIdModel.findOne({key: this.getKey(userId)}).exec();
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

 async validate(userId: number, tokenId: string): Promise<boolean> {
    const stored = await this.tockenIdModel.findOne({key: this.getKey(userId)});
    const storedId = stored.value;
    if (storedId !== tokenId) {
      throw new InvalidatedRefreshTokenError();
    }
    return storedId === tokenId;
 }

 async invalidate(userId: number): Promise<void> {
   await this.tockenIdModel.deleteOne({key: this.getKey(userId)});

 }

 private getKey(userId: number): string {
    return `${userId}`;
 }
}
