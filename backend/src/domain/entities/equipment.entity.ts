import { Field, ObjectType, ID } from '@nestjs/graphql';
import { randomUUID } from 'crypto';
import { EquipmentType } from './equipment-type.entity';

@ObjectType()
export class Equipment {
    @Field(() => ID)
    id: string;

    @Field()
    name: string;

    @Field()
    equipmentTypeId: string;

    @Field(() => EquipmentType, { nullable: true })
    equipmentType?: EquipmentType;

    @Field()
    brand: string;

    @Field()
    model: string;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;

    static create(data: {
        name: string;
        equipmentTypeId: string;
        brand: string;
        model: string;
    }): Equipment {
        if (!data.name || data.name.length < 2) {
            throw new Error('Equipment name must be at least 2 characters');
        }

        return new Equipment({
            ...data,
            id: randomUUID(),
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }

    constructor(data: Partial<Equipment>) {
        Object.assign(this, data);
    }
}