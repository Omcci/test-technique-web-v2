import { Inject, Injectable } from '@nestjs/common';
import { Equipment } from '../../domain/entities/equipment.entity';
import { IEquipmentRepository } from '../../domain/repositories/equipment.repository.interface';
import { CreateEquipmentInput } from '../dto/create-equipment.input';
import { UpdateEquipmentInput } from '../dto/update-equipment.input';

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

    async update(input: UpdateEquipmentInput): Promise<Equipment> {
        return this.equipmentRepository.update(input);
    }

    async delete(id: string): Promise<boolean> {
        return this.equipmentRepository.delete(id);
    }
}