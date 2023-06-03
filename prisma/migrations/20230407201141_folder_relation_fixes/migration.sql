/*
  Warnings:

  - You are about to drop the column `childFolderId` on the `Folder` table. All the data in the column will be lost.
  - Added the required column `parentFolderId` to the `Folder` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Folder" DROP CONSTRAINT "Folder_childFolderId_fkey";

-- DropIndex
DROP INDEX "Folder_childFolderId_key";

-- AlterTable
ALTER TABLE "Folder" DROP COLUMN "childFolderId",
ADD COLUMN     "parentFolderId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_parentFolderId_fkey" FOREIGN KEY ("parentFolderId") REFERENCES "Folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
