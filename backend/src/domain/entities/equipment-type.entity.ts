import { Field, ObjectType, ID, Int } from '@nestjs/graphql';
import { IsString, IsOptional, IsInt, Min, Max } from 'class-validator';
import { randomUUID } from 'crypto';

@ObjectType()
export class EquipmentType {
    @Field(() => ID)
    id: string;

    @Field()
    @IsString()
    name: string;

    @Field(() => Int)
    @IsInt()
    @Min(1)
    @Max(4)
    level: number;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    parentId?: string;

    @Field(() => EquipmentType, { nullable: true })
    parent?: EquipmentType;

    @Field(() => [EquipmentType], { nullable: true })
    children?: EquipmentType[];

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;

    static create(data: {
        name: string;
        level?: number;
        parentId?: string;
    }): EquipmentType {
        if (!this.validateName(data.name)) {
            throw new Error('Invalid equipment type name');
        }

        return new EquipmentType({
            ...data,
            id: randomUUID(),
            level: data.level || 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }

    static validateName(name: string): boolean {
        return name.length >= 2 && name.length <= 100;
    }

    constructor(data: Partial<EquipmentType>) {
        Object.assign(this, data);
    }
}