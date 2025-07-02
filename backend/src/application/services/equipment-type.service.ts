import { Inject, Injectable } from '@nestjs/common';
import { EquipmentType } from '../../domain/entities/equipment-type.entity';
import { IEquipmentTypeRepository } from '../../domain/repositories/equipment-type.repository.interface';
import { CreateEquipmentTypeInput } from '../dto/create-equipment-type.input';

@Injectable()
export class EquipmentTypeService {
    constructor(
        @Inject('IEquipmentTypeRepository')
        private equipmentTypeRepository: IEquipmentTypeRepository) { }

    async create(input: CreateEquipmentTypeInput): Promise<EquipmentType> {
        const equipmentType = EquipmentType.create(input);
        return this.equipmentTypeRepository.create(equipmentType);
    }

    async findAll(): Promise<EquipmentType[]> {
        return this.equipmentTypeRepository.findAll();
    }
}