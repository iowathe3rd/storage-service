/*
  Warnings:

  - A unique constraint covering the columns `[childFolderId]` on the table `Folder` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Folder" ADD COLUMN     "childFolderId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Folder_childFolderId_key" ON "Folder"("childFolderId");

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_childFolderId_fkey" FOREIGN KEY ("childFolderId") REFERENCES "Folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
