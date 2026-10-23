import { PartialType } from '@nestjs/mapped-types';
import { CreateRepositoryDto } from './create-repository.dto.js';

export class UpdateRepositoryDto extends PartialType(CreateRepositoryDto) {}
