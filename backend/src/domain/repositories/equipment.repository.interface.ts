import { Equipment } from "../entities/equipment.entity";

export interface IEquipmentRepository {
    save(equipment: Equipment): Promise<Equipment>;
    findAll(): Promise<Equipment[]>;
}