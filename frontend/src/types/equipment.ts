export interface Equipment {
    id: string;
    name: string;
    equipmentTypeId: string;
    equipmentType?: EquipmentType;
    brand: string;
    model: string;
    createdAt: string;
    updatedAt: string;
}

export interface EquipmentType {
    id: string;
    name: string;
    level: number;
    parentId?: string;
    parent?: EquipmentType;
    children?: EquipmentType[];
    createdAt: string;
    updatedAt: string;
}

export interface CreateEquipmentInput {
    name: string;
    equipmentTypeId: string;
    brand: string;
    model: string;
}

export interface CreateEquipmentTypeInput {
    name: string;
    level?: number;
    parentId?: string;
}

export interface UpdateEquipmentInput {
    id: string;
    name?: string;
    equipmentTypeId?: string;
    brand?: string;
    model?: string;
}