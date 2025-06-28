import { Injectable } from '@nestjs/common';
import { Equipment } from '../../../domain/entities/equipment.entity';
import { IEquipmentRepository } from '../../../domain/repositories/equipment.repository.interface';
import { PrismaService } from '../prisma.service';
import { UpdateEquipmentInput } from '../../../application/dto/update-equipment.input';

@Injectable()
export class EquipmentRepository implements IEquipmentRepository {
    constructor(private prisma: PrismaService) { }

    async save(equipment: Equipment): Promise<Equipment> {
        const data = await this.prisma.equipment.create({
            data: {
                id: equipment.id,
                name: equipment.name,
                equipmentTypeId: equipment.equipmentTypeId,
                brand: equipment.brand,
                model: equipment.model,
                createdAt: equipment.createdAt,
                updatedAt: equipment.updatedAt,
            },
            include: {
                equipmentType: true,
            },
        })
        return new Equipment(data);
    }

    async findAll(): Promise<Equipment[]> {
        const equipments = await this.prisma.equipment.findMany({
            include: {
                equipmentType: {
                    include: {
                        parent: {
                            include: {
                                parent: {
                                    include: {
                                        parent: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        })
        return equipments.map((equipment: Equipment) => new Equipment(equipment));
    }

    async update(input: UpdateEquipmentInput): Promise<Equipment> {
        const data = await this.prisma.equipment.update({
            where: { id: input.id },
            data: {
                ...input,
                updatedAt: new Date(),
            },
            include: {
                equipmentType: {
                    include: {
                        parent: {
                            include: {
                                parent: {
                                    include: {
                                        parent: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        return new Equipment(data);
    }

    async delete(id: string): Promise<boolean> {
        await this.prisma.equipment.delete({ where: { id } });
        return true;
    }
}