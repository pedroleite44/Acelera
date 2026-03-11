/*
  Warnings:

  - You are about to drop the `Log` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Log" DROP CONSTRAINT "Log_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Log" DROP CONSTRAINT "Log_studentId_fkey";

-- DropTable
DROP TABLE "Log";

-- CreateTable
CREATE TABLE "DailyLog" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "food" TEXT,
    "sleep" TEXT,
    "hygiene" TEXT,
    "observations" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DailyLog_studentId_idx" ON "DailyLog"("studentId");

-- CreateIndex
CREATE INDEX "DailyLog_date_idx" ON "DailyLog"("date");
