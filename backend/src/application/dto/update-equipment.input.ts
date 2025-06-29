import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateEquipmentInput {
    @Field()
    id: string;

    @Field({ nullable: true })
    name?: string;

    @Field({ nullable: true })
    equipmentTypeId?: string;

    @Field({ nullable: true })
    brand?: string;

    @Field({ nullable: true })
    model?: string;
}