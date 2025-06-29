import { Equipment } from "../entities/equipment.entity";
import { UpdateEquipmentInput } from "../../application/dto/update-equipment.input";

export interface IEquipmentRepository {
    save(equipment: Equipment): Promise<Equipment>;
    findAll(): Promise<Equipment[]>;
    update(input: UpdateEquipmentInput): Promise<Equipment>;
    delete(id: string): Promise<boolean>;
}