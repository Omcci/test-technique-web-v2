import { EquipmentType } from '../entities/equipment-type.entity';

export interface IEquipmentTypeRepository {
    create(equipmentType: EquipmentType): Promise<EquipmentType>;
    findAll(): Promise<EquipmentType[]>;
}