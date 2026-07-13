-- AlterTable
ALTER TABLE "ExamAttempt" ADD COLUMN     "fullscreenExitCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "tabSwitchCount" INTEGER NOT NULL DEFAULT 0;
