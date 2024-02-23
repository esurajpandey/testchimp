/*
  Warnings:

  - The `marks` column on the `CandidateAssessment` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "CandidateAssessment" DROP COLUMN "marks",
ADD COLUMN     "marks" INTEGER;
