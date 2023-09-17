import { IsString, IsArray, IsOptional } from 'class-validator';

export class UpdateItemDto {
    @IsString()
    @IsOptional()
    itemName: string;
  
    @IsString()
    @IsOptional()
    title: string;
  
    @IsString()
    @IsOptional()
    category: string;
  
    @IsArray()
    @IsOptional()
    imageNames: string[];
}