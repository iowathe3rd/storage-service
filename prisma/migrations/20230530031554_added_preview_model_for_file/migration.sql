-- CreateTable
CREATE TABLE "Preview" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "extension" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,

    CONSTRAINT "Preview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Preview_fileId_key" ON "Preview"("fileId");

-- AddForeignKey
ALTER TABLE "Preview" ADD CONSTRAINT "Preview_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE CASCADE ON UPDATE CASCADE;
