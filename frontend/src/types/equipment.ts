export interface Equipment {
    id: string;
    name: string;
    equipmentTypeId: string;
    brand: string;
    model: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateEquipmentInput {
    name: string;
    equipmentTypeId: string;
    brand: string;
    model: string;
}
