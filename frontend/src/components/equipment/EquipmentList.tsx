import { useEquipments } from '../../hooks/useEquipments';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../ui/table';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Plus, Loader2 } from 'lucide-react';

interface EquipmentListProps {
    onAddEquipment: () => void;
}

export function EquipmentList({ onAddEquipment }: EquipmentListProps) {
    const { data: equipments, isLoading, error } = useEquipments();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading equipments...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 text-red-600">
                Error loading equipments: {error.message}
            </div>
        );
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Equipment List</CardTitle>
                <Button onClick={onAddEquipment}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Equipment
                </Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Brand</TableHead>
                            <TableHead>Model</TableHead>
                            <TableHead>Type ID</TableHead>
                            <TableHead>Created</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {equipments?.map((equipment) => (
                            <TableRow key={equipment.id}>
                                <TableCell className="font-medium">{equipment.name}</TableCell>
                                <TableCell>{equipment.brand}</TableCell>
                                <TableCell>{equipment.model}</TableCell>
                                <TableCell>{equipment.equipmentTypeId}</TableCell>
                                <TableCell>
                                    {new Date(equipment.createdAt).toLocaleDateString()}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {equipments?.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        No equipments found. Add your first equipment!
                    </div>
                )}
            </CardContent>
        </Card>
    );
}