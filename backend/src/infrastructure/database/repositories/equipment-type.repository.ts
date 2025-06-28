import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { EquipmentType } from '../../../domain/entities/equipment-type.entity';
import { IEquipmentTypeRepository } from '../../../domain/repositories/equipment-type.repository.interface';

@Injectable()
export class EquipmentTypeRepository implements IEquipmentTypeRepository {
    constructor(private prisma: PrismaService) { }

    async create(equipmentType: EquipmentType): Promise<EquipmentType> {
        const created = await this.prisma.equipmentType.create({
            data: {
                id: equipmentType.id,
                name: equipmentType.name,
                level: equipmentType.level,
                parentId: equipmentType.parentId,
            },
        });

        return new EquipmentType(created);
    }

    async findAll(): Promise<EquipmentType[]> {
        const equipmentTypes = await this.prisma.equipmentType.findMany({
            include: {
                parent: {
                    include: {
                        parent: {
                            include: {
                                parent: true,
                            },
                        },
                    },
                }
            },
        });

        return equipmentTypes.map(et => new EquipmentType(et));
    }
}