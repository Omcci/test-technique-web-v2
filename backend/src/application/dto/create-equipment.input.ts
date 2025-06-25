import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateEquipmentInput {
    @Field()
    name: string;

    @Field()
    equipmentTypeId: string;

    @Field()
    brand: string;

    @Field()
    model: string;
}