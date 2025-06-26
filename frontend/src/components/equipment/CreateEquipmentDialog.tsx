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
                        <Label htmlFor="equipmentTypeId">Equipment Type ID</Label>
                        <Input
                            id="equipmentTypeId"
                            value={formData.equipmentTypeId}
                            onChange={(e) => setFormData({ ...formData, equipmentTypeId: e.target.value })}
                            required
                            className="mt-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                        />
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
                            disabled={createEquipment.isPending}
                            className="bg-blue-200 hover:bg-blue-700 text-white"
                        >
                            {createEquipment.isPending ? 'Creating...' : 'Create Equipment'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}