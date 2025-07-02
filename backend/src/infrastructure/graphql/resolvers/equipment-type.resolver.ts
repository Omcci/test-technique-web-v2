import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { EquipmentType } from '../../../domain/entities/equipment-type.entity';
import { CreateEquipmentTypeInput } from '../../../application/dto/create-equipment-type.input';
import { EquipmentTypeService } from '../../../application/services/equipment-type.service';

@Resolver(() => EquipmentType)
export class EquipmentTypeResolver {
    constructor(private equipmentTypeService: EquipmentTypeService) { }

    @Query(() => [EquipmentType])
    async equipmentTypes(): Promise<EquipmentType[]> {
        return this.equipmentTypeService.findAll();
    }

    @Mutation(() => EquipmentType)
    async createEquipmentType(
        @Args('input') input: CreateEquipmentTypeInput,
    ): Promise<EquipmentType> {
        return this.equipmentTypeService.create(input);
    }
}