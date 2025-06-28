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
      equipmentType {
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
            parent {
              id
              name
              level
            }
          }
        }
      }
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
      equipmentType {
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
            parent {
              id
              name
              level
            }
          }
        }
      }
      createdAt
      updatedAt
    }
  }
`;

const UPDATE_EQUIPMENT = `
  mutation UpdateEquipment($input: UpdateEquipmentInput!) {
    updateEquipment(input: $input) {
      id
      name
      brand
      model
      equipmentTypeId
      equipmentType {
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
            parent {
              id
              name
              level
            }
          }
        }
      }
      createdAt
      updatedAt
    }
  }
`;

const DELETE_EQUIPMENT = `
  mutation DeleteEquipment($id: String!) {
    deleteEquipment(id: $id)
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

export function useUpdateEquipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateEquipmentInput): Promise<Equipment> => {
      const data = await graphqlRequest(UPDATE_EQUIPMENT, { input });
      return data.updateEquipment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipments'] });
    },
  });
}

export function useDeleteEquipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<boolean> => {
      const data = await graphqlRequest(DELETE_EQUIPMENT, { id });
      return data.deleteEquipment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipments'] });
    },
  });
}