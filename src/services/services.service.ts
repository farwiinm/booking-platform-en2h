import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './service.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
  ) {}

  findAll() {
    return this.serviceRepository.find();
  }

  async findOne(id: number) {
    const service = await this.serviceRepository.findOne({ where: { id } });
    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    return service;
  }

  async create(dto: CreateServiceDto) {
    const service = this.serviceRepository.create(dto);
    return this.serviceRepository.save(service);
  }

  async update(id: number, dto: UpdateServiceDto) {
    await this.findOne(id); // throws 404 if not found
    await this.serviceRepository.update(id, dto);
    return this.findOne(id); // return the updated record
  }

  async remove(id: number) {
    await this.findOne(id); // throws 404 if not found
    await this.serviceRepository.delete(id);
    return { message: `Service ${id} deleted successfully` };
  }
}
