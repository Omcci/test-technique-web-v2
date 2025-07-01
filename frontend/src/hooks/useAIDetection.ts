import { useMutation } from '@tanstack/react-query';
import { graphqlRequest } from '../lib/graphql-client';

interface AIDetectionInput {
    name: string;
    brand: string;
    model: string;
    description?: string;
}

export interface AIDetectionResult {
    domain?: string;
    type?: string;
    category?: string;
    subcategory?: string;
    confidence: number;
    reasoning: string;
}

const DETECT_EQUIPMENT_TYPE = `
  query DetectEquipmentType($name: String!, $brand: String!, $model: String!, $description: String) {
    detectEquipmentType(name: $name, brand: $brand, model: $model, description: $description)
  }
`;

export function useAIDetection() {
    return useMutation({
        mutationFn: async (input: AIDetectionInput): Promise<AIDetectionResult> => {
            const data = await graphqlRequest(DETECT_EQUIPMENT_TYPE, input);
            return JSON.parse(data.detectEquipmentType);
        },
    });
}