import { Injectable } from '@nestjs/common';
import { CreateAdminApiDto } from '../../modules/admin-api/dto/create-admin-api.dto';
import { UpdateAdminApiDto } from '../../modules/admin-api/dto/update-admin-api.dto';

@Injectable()
export class AdminApiService {
  create(createAdminApiDto: CreateAdminApiDto) {
    return 'This action adds a new adminApi';
  }

  findAll() {
    return `This action returns all adminApi`;
  }

  findOne(id: number) {
    return `This action returns a #${id} adminApi`;
  }

  update(id: number, updateAdminApiDto: UpdateAdminApiDto) {
    return `This action updates a #${id} adminApi`;
  }

  remove(id: number) {
    return `This action removes a #${id} adminApi`;
  }
}
