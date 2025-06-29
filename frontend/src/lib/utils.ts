import type { EquipmentType } from "@/types/equipment";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function truncateText(text: string, maxLength: number = 26): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function getEquipmentTypeHierarchy(equipmentType: EquipmentType, includeFullPath = false): {
  domain?: string;
  type?: string;
  category?: string;
  subcategory?: string;
  fullPath?: string;
} {
  if (!equipmentType) {
    return includeFullPath ? { fullPath: 'Unknown' } : {};
  }

  const pathParts: string[] = [];
  let currentType: EquipmentType | undefined = equipmentType;

  while (currentType) {
    pathParts.unshift(currentType.name);
    currentType = currentType.parent;
  }

  const result: {
    domain?: string;
    type?: string;
    category?: string;
    subcategory?: string;
    fullPath?: string;
  } = {
    domain: pathParts[0],
    type: pathParts[1],
    category: pathParts[2],
    subcategory: pathParts[3],
  };

  if (includeFullPath) {
    result.fullPath = pathParts.join(' > ');
  }

  return result;
}

