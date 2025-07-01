import { useEffect, useState } from 'react';
import { useCreateEquipment } from '../../hooks/useEquipments';
import { useAIDetection } from '../../hooks/useAIDetection';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog';
import { toast } from "sonner"
import { CascadeEquipmentTypeSelect } from './CascadeEquipmentTypeSelect';
import { Sparkles, Loader2 } from 'lucide-react';
import { findEquipmentTypeIdFromHierarchy } from '@/lib/utils';
import { useEquipmentTypes } from '@/hooks/useEquipmentTypes';

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
        description: '',
        isAIGenerated: false,
    });

    const createEquipment = useCreateEquipment();
    const aiDetection = useAIDetection();
    const { data: equipmentTypes, isLoading: isLoadingTypes } = useEquipmentTypes();

    useEffect(() => {
        if (open && !formData.name && !formData.equipmentTypeId && !formData.brand && !formData.model && !formData.description) {
            setFormData({ name: '', equipmentTypeId: '', brand: '', model: '', description: '', isAIGenerated: false });
        }
    }, [open]);

    const handleAIDetection = async () => {
        if (!formData.name || !formData.brand || !formData.model) {
            toast.error('Please fill in name, brand, and model first');
            return;
        }

        try {
            const result = await aiDetection.mutateAsync({
                name: formData.name,
                brand: formData.brand,
                model: formData.model,
                description: formData.description,
            });

            if (result.confidence > 0.7) {
                // Find the equipment type ID based on AI suggestion
                const detectedId = findEquipmentTypeIdFromHierarchy(result, equipmentTypes || []);

                if (detectedId) {
                    setFormData({ ...formData, equipmentTypeId: detectedId, isAIGenerated: true });
                    toast.success(`AI detected: ${result.domain} → ${result.type} → ${result.category} → ${result.subcategory} (${Math.round(result.confidence * 100)}% confidence)`);
                } else {
                    toast.warning(`AI suggestion: ${result.reasoning} (Could not find exact match)`);
                }
            } else {
                toast.warning(`AI suggestion: ${result.reasoning} (Low confidence: ${Math.round(result.confidence * 100)}%)`);
            }
        } catch (error) {
            toast.error('AI detection failed. Please select manually.');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const { isAIGenerated, ...equipmentData } = formData;
            await createEquipment.mutateAsync(equipmentData);
            toast.success('Equipment created successfully!');
            setFormData({ name: '', equipmentTypeId: '', brand: '', model: '', description: '', isAIGenerated: false });
            onOpenChange(false);
        } catch (error) {
            toast.error('Failed to create equipment');
        }
    };


    const handleCancel = () => {
        setFormData({ name: '', equipmentTypeId: '', brand: '', model: '', description: '', isAIGenerated: false });
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Create New Equipment</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                minLength={2}
                                maxLength={255}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <Label htmlFor="brand">Brand</Label>
                            <Input
                                id="brand"
                                value={formData.brand}
                                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                required
                                minLength={1}
                                maxLength={255}
                                className="mt-2"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="model">Model</Label>
                            <Input
                                id="model"
                                value={formData.model}
                                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                required
                                minLength={1}
                                maxLength={255}
                                className="mt-2"
                            />
                        </div>
                        <div className="flex items-end">
                            <Button
                                type="button"
                                onClick={handleAIDetection}
                                disabled={aiDetection.isPending || !formData.name || !formData.brand || !formData.model || isLoadingTypes || !equipmentTypes}
                                className="w-full"
                                variant="outline"
                            >
                                {aiDetection.isPending ? (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                    <Sparkles className="h-4 w-4 mr-2" />
                                )}
                                AI Detect Type
                            </Button>
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="description">Description (Optional)</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Additional details about the equipment..."
                            className="mt-2"
                            rows={3}
                        />
                    </div>

                    <CascadeEquipmentTypeSelect
                        value={formData.equipmentTypeId}
                        onValueChange={(value) => {
                            setFormData({ ...formData, equipmentTypeId: value, isAIGenerated: false });
                        }}
                        disabled={createEquipment.isPending}
                        isAIGenerated={formData.isAIGenerated}
                    />

                    <div className="flex justify-end space-x-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={createEquipment.isPending}
                        >
                            {createEquipment.isPending ? 'Creating...' : 'Create Equipment'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}