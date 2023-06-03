import { Module } from '@nestjs/common';
import { AdminApiService } from '../../services/admin/admin-api.service';
import { AdminApiController } from '../../controllers/admin/admin-api.controller';

@Module({
  controllers: [AdminApiController],
  providers: [AdminApiService]
})
export class AdminApiModule {}
