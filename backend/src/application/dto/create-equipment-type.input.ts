import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, IsOptional, IsInt, Min, Max } from 'class-validator';

@InputType()
export class CreateEquipmentTypeInput {
    @Field()
    @IsString()
    name: string;

    @Field(() => Int, { nullable: true })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(4)
    level?: number;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    parentId?: string;
}