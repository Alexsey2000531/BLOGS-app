-- CreateEnum
CREATE TYPE "UserPermission" AS ENUM ('BLOCK_POST', 'ALL');

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "blockedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "permissions" "UserPermission"[];
