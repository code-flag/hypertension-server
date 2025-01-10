-- CreateEnum
CREATE TYPE "EIncentiveType" AS ENUM ('limited', 'full', 'screeningIncentive', 'clientIncentive');

-- CreateEnum
CREATE TYPE "EIncentiveBeneficiaryType" AS ENUM ('client', 'ppmv');

-- CreateEnum
CREATE TYPE "EPaymentType" AS ENUM ('flat');

-- CreateEnum
CREATE TYPE "EStatus" AS ENUM ('pending', 'paid', 'declined');

-- CreateEnum
CREATE TYPE "ScreeningResult" AS ENUM ('negative', 'positive', 'pending');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female');

-- CreateEnum
CREATE TYPE "ERecipientType" AS ENUM ('ppmv', 'client');

-- CreateEnum
CREATE TYPE "ETarget" AS ENUM ('client', 'ppmv', 'facility');

-- CreateTable
CREATE TABLE "Incentives" (
    "id" SERIAL NOT NULL,
    "desc" TEXT NOT NULL,
    "paymentType" "EPaymentType" NOT NULL DEFAULT 'flat',
    "incentiveType" "EIncentiveType" NOT NULL,
    "beneficiaryType" "EIncentiveBeneficiaryType" NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Incentives_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FacilityProvider" (
    "id" SERIAL NOT NULL,
    "phoneNumber" VARCHAR(15) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "state" TEXT NOT NULL,

    CONSTRAINT "FacilityProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Facility" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(15) NOT NULL,
    "state" VARCHAR(20),

    CONSTRAINT "Facility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "state" TEXT NOT NULL,
    "ppmvNumber" TEXT NOT NULL,
    "status" "EStatus" NOT NULL DEFAULT 'pending',
    "amount" INTEGER NOT NULL,
    "authorizationLevel" INTEGER NOT NULL,
    "authorizedBy" JSONB[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PpmvAgent" (
    "id" SERIAL NOT NULL,
    "phoneNumber" VARCHAR(15) NOT NULL,
    "name" VARCHAR(35) NOT NULL,
    "state" VARCHAR(20) NOT NULL,
    "totalIncentiveReceived" INTEGER NOT NULL DEFAULT 0,
    "activeIncentiveBalance" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PpmvAgent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Screening" (
    "id" SERIAL NOT NULL,
    "phoneNumber" VARCHAR(15) NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" "Gender" NOT NULL,
    "verificationCode" VARCHAR(10) NOT NULL,
    "confirmationCode" VARCHAR(10),
    "confirmationResult" "ScreeningResult" NOT NULL DEFAULT 'pending',
    "screeningResult" "ScreeningResult" NOT NULL DEFAULT 'pending',
    "clientRewardStatus" BOOLEAN NOT NULL DEFAULT false,
    "ppmvRewardStatus" BOOLEAN NOT NULL DEFAULT false,
    "ppmvPhoneNumber" TEXT NOT NULL,
    "state" VARCHAR(20) NOT NULL,
    "lga" VARCHAR(30) NOT NULL,
    "location" VARCHAR(30) NOT NULL,
    "facilityProviderNumber" TEXT,
    "facilityCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Screening_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reward" (
    "id" SERIAL NOT NULL,
    "screeningId" INTEGER NOT NULL,
    "recipientNumber" INTEGER NOT NULL,
    "recipientType" "ERecipientType" NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "incentiveType" "EIncentiveType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserActivity" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UssdCode" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "target" "ETarget" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UssdCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PaymentToPpmvAgent" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PaymentToPpmvAgent_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_PpmvAgentToReward" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PpmvAgentToReward_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "FacilityProvider_phoneNumber_key" ON "FacilityProvider"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Facility_code_key" ON "Facility"("code");

-- CreateIndex
CREATE UNIQUE INDEX "PpmvAgent_phoneNumber_key" ON "PpmvAgent"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Screening_phoneNumber_key" ON "Screening"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Screening_location_key" ON "Screening"("location");

-- CreateIndex
CREATE INDEX "_PaymentToPpmvAgent_B_index" ON "_PaymentToPpmvAgent"("B");

-- CreateIndex
CREATE INDEX "_PpmvAgentToReward_B_index" ON "_PpmvAgentToReward"("B");

-- AddForeignKey
ALTER TABLE "Screening" ADD CONSTRAINT "Screening_ppmvPhoneNumber_fkey" FOREIGN KEY ("ppmvPhoneNumber") REFERENCES "PpmvAgent"("phoneNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Screening" ADD CONSTRAINT "Screening_facilityProviderNumber_fkey" FOREIGN KEY ("facilityProviderNumber") REFERENCES "FacilityProvider"("phoneNumber") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Screening" ADD CONSTRAINT "Screening_facilityCode_fkey" FOREIGN KEY ("facilityCode") REFERENCES "Facility"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reward" ADD CONSTRAINT "Reward_screeningId_fkey" FOREIGN KEY ("screeningId") REFERENCES "Screening"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PaymentToPpmvAgent" ADD CONSTRAINT "_PaymentToPpmvAgent_A_fkey" FOREIGN KEY ("A") REFERENCES "Payment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PaymentToPpmvAgent" ADD CONSTRAINT "_PaymentToPpmvAgent_B_fkey" FOREIGN KEY ("B") REFERENCES "PpmvAgent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PpmvAgentToReward" ADD CONSTRAINT "_PpmvAgentToReward_A_fkey" FOREIGN KEY ("A") REFERENCES "PpmvAgent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PpmvAgentToReward" ADD CONSTRAINT "_PpmvAgentToReward_B_fkey" FOREIGN KEY ("B") REFERENCES "Reward"("id") ON DELETE CASCADE ON UPDATE CASCADE;
