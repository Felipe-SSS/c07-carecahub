import { Injectable } from '@nestjs/common';
import { CreateMentorDto } from './dto/create-mentor.dto.js';
import { UpdateMentorDto } from './dto/update-mentor.dto.js';

@Injectable()
export class MentorService {
  create(createMentorDto: CreateMentorDto) {
    return 'This action adds a new mentor';
  }

  findAll() {
    return `This action returns all mentors where deletedAt is null`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mentor`;
  }

  update(id: number, updateMentorDto: UpdateMentorDto) {
    return `This action updates a #${id} mentor`;
  }

  delete(id: number) {
    return `This action soft deletes a #${id} mentor`;
  }
}
