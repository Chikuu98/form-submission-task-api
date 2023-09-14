import { Controller, Post, Body, Get } from '@nestjs/common';
import { FormDataService } from './formData.service';
import { FormData } from './formData.model';

@Controller('forms')
export class FormDataController {
  constructor(private readonly formService: FormDataService) {}

  @Post()
  async create(@Body() formData: FormData): Promise<FormData> {
    const createdForm = await this.formService.create(formData);
    return createdForm;
  }

  @Get()
  findAll() {
    return this.formService.findAll();
  }
}
