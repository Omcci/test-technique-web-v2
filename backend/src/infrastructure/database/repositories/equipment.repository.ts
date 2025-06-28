import { Injectable } from '@nestjs/common';
import { Equipment } from '../../../domain/entities/equipment.entity';
import { IEquipmentRepository } from '../../../domain/repositories/equipment.repository.interface';
import { PrismaService } from '../prisma.service';

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
}