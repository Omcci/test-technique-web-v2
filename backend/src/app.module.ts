import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { EquipmentResolver } from './infrastructure/graphql/resolvers/equipment.resolver';
import { EquipmentService } from './application/services/equipment.service';
import { EquipmentRepository } from './infrastructure/database/repositories/equipment.repository';
import { PrismaService } from './infrastructure/database/prisma.service';
import { EquipmentTypeResolver } from './infrastructure/graphql/resolvers/equipment-type.resolver';
import { EquipmentTypeService } from './application/services/equipment-type.service';
import { EquipmentTypeRepository } from './infrastructure/database/repositories/equipment-type.repository';

@Module({
    imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
            playground: true,
        }),
    ],
    providers: [
        EquipmentResolver,
        EquipmentTypeResolver,
        EquipmentService,
        EquipmentTypeService,
        EquipmentRepository,
        EquipmentTypeRepository,
        PrismaService,
        { provide: 'IEquipmentRepository', useExisting: EquipmentRepository },
        { provide: 'IEquipmentTypeRepository', useExisting: EquipmentTypeRepository },
    ],
})
export class AppModule { }