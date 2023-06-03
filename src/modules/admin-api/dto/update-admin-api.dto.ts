import { PartialType } from '@nestjs/swagger';
import { CreateAdminApiDto } from './create-admin-api.dto';

export class UpdateAdminApiDto extends PartialType(CreateAdminApiDto) {}
