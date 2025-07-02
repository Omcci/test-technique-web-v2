import { Resolver, Query, Args } from '@nestjs/graphql';
import { AIDetectionService } from '../../../application/services/ai-detection.service';

@Resolver()
export class AIDetectionResolver {
    constructor(private aiDetectionService: AIDetectionService) { }

    @Query(() => String)
    async detectEquipmentType(
        @Args('name') name: string,
        @Args('brand') brand: string,
        @Args('model') model: string,
        @Args('description', { nullable: true }) description?: string
    ): Promise<string> {
        const result = await this.aiDetectionService.detectEquipmentType(
            name,
            brand,
            model,
            description
        );

        return JSON.stringify(result);
    }
}