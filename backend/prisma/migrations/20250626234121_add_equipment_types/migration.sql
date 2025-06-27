-- CreateTable
CREATE TABLE "equipment_types" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "equipment_types_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "equipment_types" ADD CONSTRAINT "equipment_types_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "equipment_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipments" ADD CONSTRAINT "equipments_id_fkey" FOREIGN KEY ("id") REFERENCES "equipment_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
