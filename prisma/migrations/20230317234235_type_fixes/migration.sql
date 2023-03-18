/*
  Warnings:

  - Added the required column `extenstion` to the `Files` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originalName` to the `Files` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Files" ADD COLUMN     "extenstion" TEXT NOT NULL,
ADD COLUMN     "originalName" TEXT NOT NULL;
