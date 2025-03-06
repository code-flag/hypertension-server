/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `PpmvAgent` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `PpmvAgent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PpmvAgent" ADD COLUMN     "email" VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE "Screening" ADD COLUMN     "isDiagnosed" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "PpmvAgent_email_key" ON "PpmvAgent"("email");
