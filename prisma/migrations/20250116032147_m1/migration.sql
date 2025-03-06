/*
  Warnings:

  - The values [paid] on the enum `EStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `ppmvNumber` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `lga` on the `PpmvAgent` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `PpmvAgent` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `PpmvAgent` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `PpmvAgent` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `PpmvAgent` table. All the data in the column will be lost.
  - You are about to drop the column `recipientNumber` on the `Reward` table. All the data in the column will be lost.
  - You are about to drop the column `facilityProviderNumber` on the `Screening` table. All the data in the column will be lost.
  - You are about to drop the column `ppmvPhoneNumber` on the `Screening` table. All the data in the column will be lost.
  - You are about to drop the `Coordinator` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Facility` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FacilityProvider` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[ppmvCode]` on the table `PpmvAgent` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ppmvCode` to the `PpmvAgent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ppmvCode` to the `Screening` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ppmvEmail` to the `Screening` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EStatus_new" AS ENUM ('pending', 'approved', 'processing', 'declined');
ALTER TABLE "Payment" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Payment" ALTER COLUMN "status" TYPE "EStatus_new" USING ("status"::text::"EStatus_new");
ALTER TYPE "EStatus" RENAME TO "EStatus_old";
ALTER TYPE "EStatus_new" RENAME TO "EStatus";
DROP TYPE "EStatus_old";
ALTER TABLE "Payment" ALTER COLUMN "status" SET DEFAULT 'pending';
COMMIT;

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_ppmvNumber_fkey";

-- DropForeignKey
ALTER TABLE "Screening" DROP CONSTRAINT "Screening_facilityCode_fkey";

-- DropForeignKey
ALTER TABLE "Screening" DROP CONSTRAINT "Screening_facilityProviderNumber_fkey";

-- DropForeignKey
ALTER TABLE "Screening" DROP CONSTRAINT "Screening_ppmvPhoneNumber_fkey";

-- DropIndex
DROP INDEX "PpmvAgent_phoneNumber_key";

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "ppmvNumber",
ADD COLUMN     "ppmvCode" TEXT;

-- AlterTable
ALTER TABLE "PpmvAgent" DROP COLUMN "lga",
DROP COLUMN "location",
DROP COLUMN "name",
DROP COLUMN "phoneNumber",
DROP COLUMN "state",
ADD COLUMN     "ppmvCode" VARCHAR(15) NOT NULL;

-- AlterTable
ALTER TABLE "Reward" DROP COLUMN "recipientNumber",
ADD COLUMN     "recipientCode" TEXT,
ADD COLUMN     "recipientPhoneNumber" TEXT;

-- AlterTable
ALTER TABLE "Screening" DROP COLUMN "facilityProviderNumber",
DROP COLUMN "ppmvPhoneNumber",
ADD COLUMN     "facilityProviderCode" TEXT,
ADD COLUMN     "ppmvCode" TEXT NOT NULL,
ADD COLUMN     "ppmvEmail" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "UserActivity" ADD COLUMN     "userName" TEXT;

-- DropTable
DROP TABLE "Coordinator";

-- DropTable
DROP TABLE "Facility";

-- DropTable
DROP TABLE "FacilityProvider";

-- CreateTable
CREATE TABLE "_PpmvAgentToScreening" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PpmvAgentToScreening_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_PpmvAgentToScreening_B_index" ON "_PpmvAgentToScreening"("B");

-- CreateIndex
CREATE UNIQUE INDEX "PpmvAgent_ppmvCode_key" ON "PpmvAgent"("ppmvCode");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_ppmvCode_fkey" FOREIGN KEY ("ppmvCode") REFERENCES "PpmvAgent"("ppmvCode") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PpmvAgentToScreening" ADD CONSTRAINT "_PpmvAgentToScreening_A_fkey" FOREIGN KEY ("A") REFERENCES "PpmvAgent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PpmvAgentToScreening" ADD CONSTRAINT "_PpmvAgentToScreening_B_fkey" FOREIGN KEY ("B") REFERENCES "Screening"("id") ON DELETE CASCADE ON UPDATE CASCADE;
