import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { EquipmentResolver } from './infrastructure/graphql/resolvers/equipment.resolver';
import { EquipmentService } from './application/services/equipment.service';
import { EquipmentRepository } from './infrastructure/database/repositories/equipment.repository';
import { PrismaService } from './infrastructure/database/prisma.service';

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
        EquipmentService,
        EquipmentRepository,
        PrismaService,
        { provide: 'IEquipmentRepository', useExisting: EquipmentRepository },
    ],
})
export class AppModule { }