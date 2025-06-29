import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { useEquipmentTypes } from '@/hooks/useEquipmentTypes';
import { getEquipmentTypeHierarchy } from '@/lib/utils';

interface CascadeEquipmentTypeSelectProps {
    value: string;
    onValueChange: (value: string) => void;
    disabled?: boolean;
}

export function CascadeEquipmentTypeSelect({ value, onValueChange, disabled }: CascadeEquipmentTypeSelectProps) {
    const { data: equipmentTypes, isLoading } = useEquipmentTypes();

    const [selectedDomain, setSelectedDomain] = useState<string>('');
    const [selectedType, setSelectedType] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');

    // unique values for each level
    const domains = equipmentTypes?.filter(type => type.level === 1) || [];
    const types = equipmentTypes?.filter(type =>
        type.level === 2 &&
        type.parent?.id === domains.find(d => d.name === selectedDomain)?.id
    ) || [];
    const categories = equipmentTypes?.filter(type =>
        type.level === 3 &&
        type.parent?.id === types.find(t => t.name === selectedType)?.id
    ) || [];
    const subcategories = equipmentTypes?.filter(type =>
        type.level === 4 &&
        type.parent?.id === categories.find(c => c.name === selectedCategory)?.id
    ) || [];

    const findEquipmentTypeId = (): string => {
        if (!equipmentTypes) return '';
        // search for deepest selected level
        if (selectedSubcategory) {
            const targetType = equipmentTypes.find(type =>
                type.level === 4 &&
                type.name === selectedSubcategory &&
                type.parent?.name === selectedCategory
            );
            return targetType?.id || '';
        } else if (selectedCategory) {
            const targetType = equipmentTypes.find(type =>
                type.level === 3 &&
                type.name === selectedCategory &&
                type.parent?.name === selectedType
            );
            return targetType?.id || '';
        } else if (selectedType) {
            const targetType = equipmentTypes.find(type =>
                type.level === 2 &&
                type.name === selectedType &&
                type.parent?.name === selectedDomain
            );
            return targetType?.id || '';
        } else if (selectedDomain) {
            const targetType = equipmentTypes.find(type =>
                type.level === 1 &&
                type.name === selectedDomain
            );
            return targetType?.id || '';
        }
        return '';
    };

    // update parent
    useEffect(() => {
        const equipmentTypeId = findEquipmentTypeId();
        if (equipmentTypeId) {
            onValueChange(equipmentTypeId);
        }
    }, [selectedDomain, selectedType, selectedCategory, selectedSubcategory]);

    // initialize from current value
    useEffect(() => {
        if (value && equipmentTypes) {
            const currentType = equipmentTypes.find(type => type.id === value);
            if (currentType) {
                const hierarchy = getEquipmentTypeHierarchy(currentType);
                setSelectedDomain(hierarchy.domain || '');
                setSelectedType(hierarchy.type || '');
                setSelectedCategory(hierarchy.category || '');
                setSelectedSubcategory(hierarchy.subcategory || '');
            }
        }
    }, [value, equipmentTypes]);

    // reset cascading dropdowns when parent changes
    const handleDomainChange = (domain: string) => {
        setSelectedDomain(domain);
        setSelectedType('');
        setSelectedCategory('');
        setSelectedSubcategory('');
    };

    const handleTypeChange = (type: string) => {
        setSelectedType(type);
        setSelectedCategory('');
        setSelectedSubcategory('');
    };

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        setSelectedSubcategory('');
    };

    if (isLoading) {
        return <div className="space-y-2">
            <Label>Equipment Type</Label>
            <div className="h-9 bg-gray-100 animate-pulse rounded-md"></div>
        </div>;
    }

    return (
        <div className="space-y-4">
            <Label>Equipment Type</Label>
            <div>
                <Label className="text-sm text-gray-600">Domain</Label>
                <Select value={selectedDomain} onValueChange={handleDomainChange} disabled={disabled}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select domain" />
                    </SelectTrigger>
                    <SelectContent>
                        {domains.map(domain => (
                            <SelectItem key={domain.id} value={domain.name}>
                                {domain.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            {selectedDomain && (
                <div>
                    <Label className="text-sm text-gray-600">Type</Label>
                    <Select
                        value={selectedType}
                        onValueChange={handleTypeChange}
                        disabled={disabled || !selectedDomain || types.length === 0}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                            {types.map(type => (
                                <SelectItem key={type.id} value={type.name}>
                                    {type.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}
            {selectedType && (
                <div>
                    <Label className="text-sm text-gray-600">Category</Label>
                    <Select
                        value={selectedCategory}
                        onValueChange={handleCategoryChange}
                        disabled={disabled || !selectedType || categories.length === 0}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map(category => (
                                <SelectItem key={category.id} value={category.name}>
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}
            {/* Subcategory Selection */}
            {selectedCategory && (
                <div>
                    <Label className="text-sm text-gray-600">Subcategory</Label>
                    <Select
                        value={selectedSubcategory}
                        onValueChange={setSelectedSubcategory}
                        disabled={disabled || !selectedCategory || subcategories.length === 0}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select subcategory" />
                        </SelectTrigger>
                        <SelectContent>
                            {subcategories.map(subcategory => (
                                <SelectItem key={subcategory.id} value={subcategory.name}>
                                    {subcategory.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}
            {(selectedDomain || selectedType || selectedCategory || selectedSubcategory) && (
                <div className="text-sm text-gray-500 p-2 bg-gray-50 rounded-md">
                    <span className="font-medium">Selected: </span>
                    {[selectedDomain, selectedType, selectedCategory, selectedSubcategory]
                        .filter(Boolean)
                        .join(' → ')}
                </div>
            )}
        </div>
    );
}