/*
  Warnings:

  - You are about to drop the column `candidateSessionId` on the `CandidateAssessment` table. All the data in the column will be lost.
  - You are about to drop the column `assessmentId` on the `Response` table. All the data in the column will be lost.
  - You are about to drop the column `candidateId` on the `Response` table. All the data in the column will be lost.
  - You are about to drop the `CandidateSession` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ResponseTest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Snap` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `startedAt` to the `CandidateAssessment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `submittedAt` to the `CandidateAssessment` table without a default value. This is not possible if the table is not empty.
  - Made the column `invitedAt` on table `CandidateAssessment` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `feedbackId` to the `Response` table without a default value. This is not possible if the table is not empty.
  - Added the required column `responseId` to the `TestAnswer` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CandidateAssessment" DROP CONSTRAINT "CandidateAssessment_candidateSessionId_fkey";

-- DropForeignKey
ALTER TABLE "QuestionAnswer" DROP CONSTRAINT "QuestionAnswer_feedbackId_fkey";

-- DropForeignKey
ALTER TABLE "QuestionAnswer" DROP CONSTRAINT "QuestionAnswer_questionId_fkey";

-- DropForeignKey
ALTER TABLE "QuestionAnswer" DROP CONSTRAINT "QuestionAnswer_testAnswerId_fkey";

-- DropForeignKey
ALTER TABLE "Response" DROP CONSTRAINT "Response_assessmentId_fkey";

-- DropForeignKey
ALTER TABLE "Response" DROP CONSTRAINT "Response_candidateId_fkey";

-- DropForeignKey
ALTER TABLE "ResponseTest" DROP CONSTRAINT "ResponseTest_responseId_fkey";

-- DropForeignKey
ALTER TABLE "ResponseTest" DROP CONSTRAINT "ResponseTest_testId_fkey";

-- DropForeignKey
ALTER TABLE "Snap" DROP CONSTRAINT "Snap_antiCheatingId_fkey";

-- DropForeignKey
ALTER TABLE "TestAnswer" DROP CONSTRAINT "TestAnswer_feedbackId_fkey";

-- DropIndex
DROP INDEX "CandidateAssessment_candidateSessionId_key";

-- AlterTable
ALTER TABLE "AntiCheating" ADD COLUMN     "snaps" TEXT[];

-- AlterTable
ALTER TABLE "CandidateAssessment" DROP COLUMN "candidateSessionId",
ADD COLUMN     "startedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "submittedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "invitedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "QuestionAnswer" ALTER COLUMN "questionId" DROP NOT NULL,
ALTER COLUMN "testAnswerId" DROP NOT NULL,
ALTER COLUMN "feedbackId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Response" DROP COLUMN "assessmentId",
DROP COLUMN "candidateId",
ADD COLUMN     "feedbackId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TestAnswer" ADD COLUMN     "finishedAt" TIMESTAMP(3),
ADD COLUMN     "responseId" TEXT NOT NULL,
ALTER COLUMN "feedbackId" DROP NOT NULL,
ALTER COLUMN "score" DROP NOT NULL;

-- DropTable
DROP TABLE "CandidateSession";

-- DropTable
DROP TABLE "ResponseTest";

-- DropTable
DROP TABLE "Snap";

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_feedbackId_fkey" FOREIGN KEY ("feedbackId") REFERENCES "Feedback"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestAnswer" ADD CONSTRAINT "TestAnswer_feedbackId_fkey" FOREIGN KEY ("feedbackId") REFERENCES "Feedback"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestAnswer" ADD CONSTRAINT "TestAnswer_responseId_fkey" FOREIGN KEY ("responseId") REFERENCES "Response"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionAnswer" ADD CONSTRAINT "QuestionAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionAnswer" ADD CONSTRAINT "QuestionAnswer_testAnswerId_fkey" FOREIGN KEY ("testAnswerId") REFERENCES "TestAnswer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionAnswer" ADD CONSTRAINT "QuestionAnswer_feedbackId_fkey" FOREIGN KEY ("feedbackId") REFERENCES "Feedback"("id") ON DELETE SET NULL ON UPDATE CASCADE;
