import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { graphqlRequest } from '../lib/graphql-client';
import type { CreateEquipmentInput, Equipment } from '@/types/equipment';

const GET_EQUIPMENTS = `
  query GetEquipments {
    equipments {
      id
      name
      brand
      model
      equipmentTypeId
      createdAt
      updatedAt
    }
  }
`;

const CREATE_EQUIPMENT = `
  mutation CreateEquipment($input: CreateEquipmentInput!) {
    createEquipment(input: $input) {
      id
      name
      brand
      model
      equipmentTypeId
      createdAt
      updatedAt
    }
  }
`;

export function useEquipments() {
    return useQuery({
        queryKey: ['equipments'],
        queryFn: async (): Promise<Equipment[]> => {
            const data = await graphqlRequest(GET_EQUIPMENTS);
            return data.equipments;
        },
    });
}

export function useCreateEquipment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: CreateEquipmentInput): Promise<Equipment> => {
            const data = await graphqlRequest(CREATE_EQUIPMENT, { input });
            return data.createEquipment;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['equipments'] });
        },
    });
}