-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "certificate" TEXT,
ADD COLUMN     "images" TEXT[];

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "images" TEXT[];
