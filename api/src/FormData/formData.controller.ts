import { Controller, Post, Body, Get, Patch, Param, NotFoundException, Delete } from '@nestjs/common';
import { FormDataService } from './formData.service';
import { FormData } from './formData.model';
import { Auth } from 'src/iam/authentication/decorators/auth.decorator';
import { AuthType } from 'src/iam/authentication/enums/auth-type.enums';
import { UpdateItemDto } from './dto/update-item.dto';

@Auth(AuthType.Bearer)
@Controller('forms')
export class FormDataController {
  constructor(private readonly formService: FormDataService) { }

  @Post()
  async create(@Body() formData: FormData): Promise<FormData> {
    const createdForm = await this.formService.create(formData);
    return createdForm;
  }

  @Get()
  findAll() {
    return this.formService.findAll();
  }

  @Patch(':id')
  async updateItem(
    @Param('id') itemId: string,
    @Body() updateItemDto: UpdateItemDto
  ) {
    try {
      const updatedItem = await this.formService.updateItem(itemId, updateItemDto);
      if (!updatedItem) {
        throw new NotFoundException(`FormData with id ${itemId} not found`);
      }
      return updatedItem;
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  removeItem(
    @Param('id') itemId: string,
  ) {
    return this.formService.removeItem(itemId);
  }
}
