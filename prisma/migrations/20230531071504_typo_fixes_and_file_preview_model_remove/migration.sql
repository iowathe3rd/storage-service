/*
  Warnings:

  - You are about to drop the column `key` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `originalName` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `File` table. All the data in the column will be lost.
  - You are about to drop the `Preview` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[s3Key]` on the table `File` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fullName` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `s3Key` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sizeInBytes` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Preview" DROP CONSTRAINT "Preview_fileId_fkey";

-- DropIndex
DROP INDEX "File_key_key";

-- AlterTable
ALTER TABLE "File" DROP COLUMN "key",
DROP COLUMN "originalName",
DROP COLUMN "size",
ADD COLUMN     "fullName" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "s3Key" TEXT NOT NULL,
ADD COLUMN     "sizeInBytes" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Folder" ALTER COLUMN "name" SET DEFAULT 'New Folder';

-- DropTable
DROP TABLE "Preview";

-- CreateIndex
CREATE UNIQUE INDEX "File_s3Key_key" ON "File"("s3Key");
