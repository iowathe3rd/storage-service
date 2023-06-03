-- DropForeignKey
ALTER TABLE "Folder" DROP CONSTRAINT "Folder_childFolderId_fkey";

-- DropForeignKey
ALTER TABLE "Folder" DROP CONSTRAINT "Folder_userId_fkey";

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_childFolderId_fkey" FOREIGN KEY ("childFolderId") REFERENCES "Folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
