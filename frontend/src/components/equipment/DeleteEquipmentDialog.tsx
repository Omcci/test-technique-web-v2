import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { toast } from "sonner"
import { useDeleteEquipment } from '../../hooks/useEquipments';
import type { Equipment } from '@/types/equipment';

interface DeleteConfirmationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    equipment: Equipment | null;
}

export function DeleteConfirmationDialog({ open, onOpenChange, equipment }: DeleteConfirmationDialogProps) {
    const deleteEquipment = useDeleteEquipment();

    const handleDelete = async () => {
        if (!equipment) return;

        try {
            await deleteEquipment.mutateAsync(equipment.id);
            toast.success('Equipment deleted successfully!');
            onOpenChange(false);
        } catch (error) {
            toast.error('Failed to delete equipment');
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Equipment</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete "{equipment?.name}"? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end space-x-2">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={deleteEquipment.isPending}
                    >
                        {deleteEquipment.isPending ? 'Deleting...' : 'Delete Equipment'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}