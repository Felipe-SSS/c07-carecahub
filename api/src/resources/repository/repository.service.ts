import { Injectable } from '@nestjs/common';
import { CreateRepositoryDto } from './dto/create-repository.dto.js';
import { UpdateRepositoryDto } from './dto/update-repository.dto.js';

@Injectable()
export class RepositoryService {
  create(createRepositoryDto: CreateRepositoryDto) {
    return 'This action adds a new repository';
  }

  findAll() {
    return `This action returns all repositories where deletedAt is null`;
  }

  findOne(id: number) {
    return `This action returns a #${id} repository`;
  }

  update(id: number, updateRepositoryDto: UpdateRepositoryDto) {
    return `This action updates a #${id} repository`;
  }

  delete(id: number) {
    return `This action soft deletes a #${id} repository`;
  }
}
