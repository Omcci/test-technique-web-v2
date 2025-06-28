import { useState } from 'react';
import { useCreateEquipment } from '../../hooks/useEquipments';
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


interface CreateEquipmentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateEquipmentDialog({ open, onOpenChange }: CreateEquipmentDialogProps) {
    const [formData, setFormData] = useState({
        name: '',
        equipmentTypeId: '',
        brand: '',
        model: '',
    });

    const createEquipment = useCreateEquipment();
    const { data: equipmentTypes, isLoading: isLoadingTypes } = useEquipmentTypes();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await createEquipment.mutateAsync(formData);
            toast.success('Equipment created successfully!');
            setFormData({ name: '', equipmentTypeId: '', brand: '', model: '' });
            onOpenChange(false);
        } catch (error) {
            toast.error('Failed to create equipment');
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Equipment</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            className="mt-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                        />
                    </div>
                    <div>
                        <Label htmlFor="equipmentType" className="text-sm font-medium mb-2">Equipment Type</Label>
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
                        {equipmentTypes?.length === 0 && (
                            <p className="text-sm text-orange-600 mt-1">
                                No equipment types found. Please create equipment types first.
                            </p>
                        )}
                    </div>
                    <div>
                        <Label htmlFor="brand">Brand</Label>
                        <Input
                            id="brand"
                            value={formData.brand}
                            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                            required
                            className="mt-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                        />
                    </div>
                    <div>
                        <Label htmlFor="model">Model</Label>
                        <Input
                            id="model"
                            value={formData.model}
                            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                            required
                            className="mt-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                        />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Button
                            type="button"
                            onClick={() => onOpenChange(false)}
                            className="text-white hover:bg-gray-500"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={createEquipment.isPending || isLoadingTypes}
                            className="bg-primary hover:bg-primary/90 text-white"
                        >
                            {createEquipment.isPending ? 'Creating...' : 'Create Equipment'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}