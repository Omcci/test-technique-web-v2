import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Equipment } from '../../../domain/entities/equipment.entity';
import { CreateEquipmentInput } from '../../../application/dto/create-equipment.input';
import { EquipmentService } from '../../../application/services/equipment.service';
import { UpdateEquipmentInput } from '../../../application/dto/update-equipment.input';

@Resolver(() => Equipment)
export class EquipmentResolver {
    constructor(private equipmentService: EquipmentService) { }

    @Query(() => [Equipment])
    async equipments(): Promise<Equipment[]> {
        return this.equipmentService.findAll();
    }

    @Mutation(() => Equipment)
    async createEquipment(@Args('input') input: CreateEquipmentInput): Promise<Equipment> {
        return this.equipmentService.create(input);
    }

    @Mutation(() => Equipment)
    async updateEquipment(@Args('input') input: UpdateEquipmentInput): Promise<Equipment> {
        return this.equipmentService.update(input);
    }

    @Mutation(() => Boolean)
    async deleteEquipment(@Args('id') id: string): Promise<boolean> {
        return this.equipmentService.delete(id);
    }
}