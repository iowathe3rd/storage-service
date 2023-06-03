import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AdminApiService } from '../../services/admin/admin-api.service';
import { CreateAdminApiDto } from '../../modules/admin-api/dto/create-admin-api.dto';
import { UpdateAdminApiDto } from '../../modules/admin-api/dto/update-admin-api.dto';

@Controller('admin-api')
export class AdminApiController {
  constructor(private readonly adminApiService: AdminApiService) {}

  @Post()
  create(@Body() createAdminApiDto: CreateAdminApiDto) {
    return this.adminApiService.create(createAdminApiDto);
  }

  @Get()
  findAll() {
    return this.adminApiService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminApiService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminApiDto: UpdateAdminApiDto) {
    return this.adminApiService.update(+id, updateAdminApiDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminApiService.remove(+id);
  }
}
