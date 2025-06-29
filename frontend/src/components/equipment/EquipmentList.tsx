import { useState, useMemo } from 'react';
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
import { Plus, Loader2, Search, Filter, Edit, Trash2 } from 'lucide-react';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { getEquipmentTypeHierarchy, truncateText } from '../../lib/utils';
import { CreateEquipmentDialog } from './CreateEquipmentDialog';
import { UpdateEquipmentDialog } from './UpdateEquipmentDialog';
import type { Equipment } from '@/types/equipment';
import { DeleteConfirmationDialog } from './DeleteEquipmentDialog';

export function EquipmentList() {
    const { data: equipments, isLoading, error } = useEquipments();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDomain, setFilterDomain] = useState('all-domains');
    const [filterType, setFilterType] = useState('all-types');
    const [filterCategory, setFilterCategory] = useState('all-categories');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);

    // unique filter options
    const filterOptions = useMemo(() => {
        if (!equipments) return { domains: [], types: [], categories: [] };

        const domains = new Set<string>();
        const types = new Set<string>();
        const categories = new Set<string>();

        equipments.forEach(equipment => {
            if (equipment.equipmentType) {
                const hierarchy = getEquipmentTypeHierarchy(equipment.equipmentType);
                if (hierarchy.domain) domains.add(hierarchy.domain);
                if (hierarchy.type) types.add(hierarchy.type);
                if (hierarchy.category) categories.add(hierarchy.category);
            }
        });

        return {
            domains: Array.from(domains).sort(),
            types: Array.from(types).sort(),
            categories: Array.from(categories).sort(),
        };
    }, [equipments]);

    // filter equipments with pre-computed hierarchies
    const filteredEquipments = useMemo(() => {
        if (!equipments) return [];

        return equipments
            .map(equipment => ({
                ...equipment,
                hierarchy: equipment.equipmentType ? getEquipmentTypeHierarchy(equipment.equipmentType) : {}
            }))
            .filter((equipment) => {
                const { hierarchy } = equipment;

                const searchMatch = !searchTerm ||
                    equipment.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    equipment.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    equipment.name.toLowerCase().includes(searchTerm.toLowerCase());

                const domainMatch = filterDomain === 'all-domains' || hierarchy.domain === filterDomain;
                const typeMatch = filterType === 'all-types' || hierarchy.type === filterType;
                const categoryMatch = filterCategory === 'all-categories' || hierarchy.category === filterCategory;

                return searchMatch && domainMatch && typeMatch && categoryMatch;
            });
    }, [equipments, searchTerm, filterDomain, filterType, filterCategory]);

    const handleEdit = (equipment: Equipment) => {
        setSelectedEquipment(equipment);
        setIsUpdateDialogOpen(true);
    };

    const handleDelete = (equipment: Equipment) => {
        setSelectedEquipment(equipment);
        setIsDeleteDialogOpen(true);
    };

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
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Equipment List</CardTitle>
                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Equipment
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="mb-6 space-y-4">
                        <div className="flex items-center space-x-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        placeholder="Search by brand, model, or name..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Filter className="h-4 w-4 text-gray-400" />
                                <span className="text-sm text-gray-600">Filters:</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700">Domain</label>
                                <Select value={filterDomain} onValueChange={setFilterDomain}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All domains" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all-domains">All domains</SelectItem>
                                        {filterOptions.domains.map(domain => (
                                            <SelectItem key={domain} value={domain}>
                                                {domain}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700">Type</label>
                                <Select value={filterType} onValueChange={setFilterType}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All types" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all-types">All types</SelectItem>
                                        {filterOptions.types.map(type => (
                                            <SelectItem key={type} value={type}>
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700">Category</label>
                                <Select value={filterCategory} onValueChange={setFilterCategory}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All categories" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all-categories">All categories</SelectItem>
                                        {filterOptions.categories.map(category => (
                                            <SelectItem key={category} value={category}>
                                                {category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Domain</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Sub-category</TableHead>
                                <TableHead>Brand</TableHead>
                                <TableHead>Model</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredEquipments?.map((equipment) => {
                                const { hierarchy } = equipment;

                                return (
                                    <TableRow key={equipment.id}>
                                        <TableCell className="font-medium">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <span className="cursor-help">
                                                            {truncateText(equipment.name)}
                                                        </span>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>{equipment.name}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </TableCell>
                                        <TableCell>
                                            {hierarchy.domain ? (
                                                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                                                    {hierarchy.domain}
                                                </span>
                                            ) : (
                                                <span className="text-gray-500">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {hierarchy.type ? (
                                                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">
                                                    {hierarchy.type}
                                                </span>
                                            ) : (
                                                <span className="text-gray-500">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {hierarchy.category ? (
                                                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-yellow-100 text-yellow-800">
                                                    {hierarchy.category}
                                                </span>
                                            ) : (
                                                <span className="text-gray-500">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {hierarchy.subcategory ? (
                                                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-800">
                                                    {hierarchy.subcategory}
                                                </span>
                                            ) : (
                                                <span className="text-gray-500">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <span className="cursor-help">
                                                            {truncateText(equipment.brand)}
                                                        </span>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>{equipment.brand}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </TableCell>
                                        <TableCell>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <span className="cursor-help">
                                                            {truncateText(equipment.model)}
                                                        </span>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>{equipment.model}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(equipment.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleEdit(equipment)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDelete(equipment)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                    {filteredEquipments?.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            {equipments?.length === 0
                                ? "No equipments found. Add your first equipment!"
                                : "No equipments match the current filters."
                            }
                        </div>
                    )}
                </CardContent>
            </Card>

            <CreateEquipmentDialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
            />
            <UpdateEquipmentDialog
                open={isUpdateDialogOpen}
                onOpenChange={setIsUpdateDialogOpen}
                equipment={selectedEquipment}
            />
            <DeleteConfirmationDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                equipment={selectedEquipment}
            />
        </>
    );
}