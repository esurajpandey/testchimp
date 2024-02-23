/*
  Warnings:

  - You are about to drop the `Response` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `assessmentResponseId` to the `QuestionAnswer` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CandidateAssessment" DROP CONSTRAINT "CandidateAssessment_responseId_fkey";

-- DropForeignKey
ALTER TABLE "Response" DROP CONSTRAINT "Response_feedbackId_fkey";

-- DropForeignKey
ALTER TABLE "TestAnswer" DROP CONSTRAINT "TestAnswer_responseId_fkey";

-- AlterTable
ALTER TABLE "QuestionAnswer" ADD COLUMN     "assessmentResponseId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Response";

-- CreateTable
CREATE TABLE "AssessmentResponse" (
    "id" TEXT NOT NULL,
    "feedbackId" TEXT NOT NULL,

    CONSTRAINT "AssessmentResponse_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CandidateAssessment" ADD CONSTRAINT "CandidateAssessment_responseId_fkey" FOREIGN KEY ("responseId") REFERENCES "AssessmentResponse"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentResponse" ADD CONSTRAINT "AssessmentResponse_feedbackId_fkey" FOREIGN KEY ("feedbackId") REFERENCES "Feedback"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestAnswer" ADD CONSTRAINT "TestAnswer_responseId_fkey" FOREIGN KEY ("responseId") REFERENCES "AssessmentResponse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionAnswer" ADD CONSTRAINT "QuestionAnswer_assessmentResponseId_fkey" FOREIGN KEY ("assessmentResponseId") REFERENCES "AssessmentResponse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
