import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Equipment } from '../../../domain/entities/equipment.entity';
import { CreateEquipmentInput } from '../../../application/dto/create-equipment.input';
import { EquipmentService } from '../../../application/services/equipment.service';

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
}