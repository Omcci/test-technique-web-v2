import { Inject, Injectable } from '@nestjs/common';
import { Equipment } from '../../domain/entities/equipment.entity';
import { IEquipmentRepository } from '../../domain/repositories/equipment.repository.interface';
import { CreateEquipmentInput } from '../dto/create-equipment.input';

@Injectable()
export class EquipmentService {
    constructor(
        @Inject('IEquipmentRepository')
        private equipmentRepository: IEquipmentRepository) { }

    async create(input: CreateEquipmentInput): Promise<Equipment> {
        const equipment = Equipment.create(input);
        return this.equipmentRepository.save(equipment);
    }

    async findAll(): Promise<Equipment[]> {
        return this.equipmentRepository.findAll();
    }
}