import { Injectable } from '@nestjs/common';
import { Equipment } from '../../../domain/entities/equipment.entity';
import { IEquipmentRepository } from '../../../domain/repositories/equipment.repository.interface';

@Injectable()
export class EquipmentRepository implements IEquipmentRepository {
    private equipments: Equipment[] = [];

    async save(equipment: Equipment): Promise<Equipment> {
        this.equipments.push(equipment);
        return equipment;
    }

    async findAll(): Promise<Equipment[]> {
        return this.equipments;
    }
}