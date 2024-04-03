/*
  Warnings:

  - You are about to drop the column `uuid` on the `Task` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Task_uuid_key";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "uuid",
ALTER COLUMN "deletedAt" DROP NOT NULL;
