/*
  Warnings:

  - You are about to drop the column `extenstion` on the `Files` table. All the data in the column will be lost.
  - Added the required column `extension` to the `Files` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Files" DROP COLUMN "extenstion",
ADD COLUMN     "extension" TEXT NOT NULL;
