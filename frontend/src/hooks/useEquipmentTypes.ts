import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { graphqlRequest } from '../lib/graphql-client';
import type { CreateEquipmentTypeInput, EquipmentType } from '@/types/equipment';

const GET_EQUIPMENT_TYPES = `
  query GetEquipmentTypes {
    equipmentTypes {
      id
      name
      level
      parentId
      parent {
        id
        name
        level
        parent {
          id
          name
          level
          parent {
            id
            name
            level
          }
        }
      }
      createdAt
      updatedAt
    }
  }
`;

const CREATE_EQUIPMENT_TYPE = `
  mutation CreateEquipmentType($input: CreateEquipmentTypeInput!) {
    createEquipmentType(input: $input) {
      id
      name
      level
      parentId
      parent {
        id
        name
        level
        parent {
          id
          name
          level
          parent {
            id
            name
            level
          }
        }
      }
      createdAt
      updatedAt
    }
  }
`;

export function useEquipmentTypes() {
  return useQuery({
    queryKey: ['equipmentTypes'],
    queryFn: async (): Promise<EquipmentType[]> => {
      const data = await graphqlRequest(GET_EQUIPMENT_TYPES);
      return data.equipmentTypes;
    },
  });
}

export function useCreateEquipmentType() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateEquipmentTypeInput): Promise<EquipmentType> => {
      const data = await graphqlRequest(CREATE_EQUIPMENT_TYPE, { input });
      return data.createEquipmentType;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipmentTypes'] });
    },
  });
}