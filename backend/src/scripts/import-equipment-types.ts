import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface CSVRow {
    main: string;
    typ: string;
    cat: string;
    subcat: string;
}

async function importEquipmentTypes() {
    try {
        console.log('Starting equipment types import...');

        // Read the CSV file
        const csvPath = path.join(__dirname, '../../generic_equipments.csv');
        const csvContent = fs.readFileSync(csvPath, 'utf-8');
        const lines = csvContent.split('\n').filter(line => line.trim());

        // Parse CSV (simple parsing, assuming no commas in the data)
        const rows: CSVRow[] = [];
        for (let i = 1; i < lines.length; i++) { // Skip header
            const columns = lines[i].split(',');
            if (columns.length >= 4) {
                rows.push({
                    main: columns[0].trim(),
                    typ: columns[1].trim(),
                    cat: columns[2].trim(),
                    subcat: columns[3].trim(),
                });
            }
        }

        console.log(`Found ${rows.length} equipment type entries`);

        // Create a map to track created equipment types
        const equipmentTypeMap = new Map<string, string>();

        // Process each row
        for (const row of rows) {
            // Create domain (level 1) if it doesn't exist
            if (row.main && !equipmentTypeMap.has(`main:${row.main}`)) {
                const domain = await prisma.equipmentType.create({
                    data: {
                        name: row.main,
                        level: 1,
                    },
                });
                equipmentTypeMap.set(`main:${row.main}`, domain.id);
                console.log(`Created main: ${row.main}`);
            }

            // Create type (level 2) if it doesn't exist
            if (row.typ && !equipmentTypeMap.has(`type:${row.main}:${row.typ}`)) {
                const domainId = equipmentTypeMap.get(`main:${row.main}`);
                if (domainId) {
                    const type = await prisma.equipmentType.create({
                        data: {
                            name: row.typ,
                            level: 2,
                            parentId: domainId,
                        },
                    });
                    equipmentTypeMap.set(`type:${row.main}:${row.typ}`, type.id);
                    console.log(`Created type: ${row.typ} under ${row.main}`);
                }
            }

            // Create category (level 3) if it doesn't exist
            if (row.cat && !equipmentTypeMap.has(`category:${row.main}:${row.typ}:${row.cat}`)) {
                const typeId = equipmentTypeMap.get(`type:${row.main}:${row.typ}`);
                if (typeId) {
                    const category = await prisma.equipmentType.create({
                        data: {
                            name: row.cat,
                            level: 3,
                            parentId: typeId,
                        },
                    });
                    equipmentTypeMap.set(`category:${row.main}:${row.typ}:${row.cat}`, category.id);
                    console.log(`Created category: ${row.cat} under ${row.typ}`);
                }
            }

            // Create sub-category (level 4) if it doesn't exist
            if (row.subcat && !equipmentTypeMap.has(`subcategory:${row.main}:${row.typ}:${row.cat}:${row.subcat}`)) {
                const categoryId = equipmentTypeMap.get(`category:${row.main}:${row.typ}:${row.cat}`);
                if (categoryId) {
                    const subCategory = await prisma.equipmentType.create({
                        data: {
                            name: row.subcat,
                            level: 4,
                            parentId: categoryId,
                        },
                    });
                    equipmentTypeMap.set(`subcategory:${row.main}:${row.typ}:${row.cat}:${row.subcat}`, subCategory.id);
                    console.log(`Created sub-category: ${row.subcat} under ${row.cat}`);
                }
            }
        }

        console.log('Equipment types import completed successfully!');
        console.log(`Total equipment types created: ${equipmentTypeMap.size}`);

    } catch (error) {
        console.error('Error importing equipment types:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Run the import
importEquipmentTypes()
    .then(() => {
        console.log('Import script completed');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Import script failed:', error);
        process.exit(1);
    }); 