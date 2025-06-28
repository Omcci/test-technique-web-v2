import { useState, useEffect } from 'react';
import { useUpdateEquipment } from '../../hooks/useEquipments';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog';
import { toast } from "sonner"
import { useEquipmentTypes } from '@/hooks/useEquipmentTypes';
import { Select, SelectItem, SelectContent, SelectTrigger, SelectValue } from '../ui/select';
import { getEquipmentTypeHierarchy } from '@/lib/utils';
import type { Equipment } from '@/types/equipment';

interface UpdateEquipmentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    equipment: Equipment | null;
}

export function UpdateEquipmentDialog({ open, onOpenChange, equipment }: UpdateEquipmentDialogProps) {
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        equipmentTypeId: '',
        brand: '',
        model: '',
    });

    const updateEquipment = useUpdateEquipment();
    const { data: equipmentTypes, isLoading: isLoadingTypes } = useEquipmentTypes();

    useEffect(() => {
        if (equipment) {
            setFormData({
                id: equipment.id,
                name: equipment.name,
                equipmentTypeId: equipment.equipmentTypeId,
                brand: equipment.brand,
                model: equipment.model,
            });
        }
    }, [equipment]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await updateEquipment.mutateAsync(formData);
            toast.success('Equipment updated successfully!');
            onOpenChange(false);
        } catch (error) {
            toast.error('Failed to update equipment');
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update Equipment</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <Label htmlFor="equipmentType">Equipment Type</Label>
                        <Select
                            value={formData.equipmentTypeId}
                            onValueChange={(value) => setFormData({ ...formData, equipmentTypeId: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select equipment type" />
                            </SelectTrigger>
                            <SelectContent>
                                {isLoadingTypes ? (
                                    <SelectItem value="loading" disabled>Loading...</SelectItem>
                                ) : equipmentTypes?.length === 0 ? (
                                    <SelectItem value="no-data" disabled>No equipment types available</SelectItem>
                                ) : (
                                    equipmentTypes?.map((type) => (
                                        <SelectItem key={type.id} value={type.id}>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{type.name}</span>
                                                <span className="text-xs text-gray-500">
                                                    {getEquipmentTypeHierarchy(type, true).fullPath}
                                                </span>
                                            </div>
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="brand">Brand</Label>
                        <Input
                            id="brand"
                            value={formData.brand}
                            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                            required
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <Label htmlFor="model">Model</Label>
                        <Input
                            id="model"
                            value={formData.model}
                            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                            required
                            className="mt-2"
                        />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={updateEquipment.isPending || isLoadingTypes}
                        >
                            {updateEquipment.isPending ? 'Updating...' : 'Update Equipment'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}