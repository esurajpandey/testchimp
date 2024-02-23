-- CreateEnum
CREATE TYPE "RoleType" AS ENUM ('OWNER', 'RECRUITER', 'ADMIN', 'HIRING_MANAGER');

-- CreateEnum
CREATE TYPE "CategoryType" AS ENUM ('ROLE', 'GENERAL');

-- CreateEnum
CREATE TYPE "QuestionSource" AS ENUM ('TestGorilla', 'UserLibraray');

-- CreateEnum
CREATE TYPE "Type" AS ENUM ('VIDEO', 'MCQ', 'ESSAY', 'FILE', 'CODING');

-- CreateEnum
CREATE TYPE "CandidateStatus" AS ENUM ('COMPLETED', 'STARTED', 'INVITED', 'REJECTED');

-- CreateEnum
CREATE TYPE "FeedbackType" AS ENUM ('QUESTION', 'ASSESSMENT', 'CANDIDATE', 'TEST');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "languageId" TEXT,
    "password" TEXT,
    "token" TEXT NOT NULL DEFAULT '',
    "jobTitle" TEXT,
    "roleId" TEXT,
    "notificationId" TEXT,
    "teamId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "emailUpdate" BOOLEAN NOT NULL DEFAULT false,
    "candidateAlert" BOOLEAN NOT NULL DEFAULT false,
    "candidateSummary" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "companyId" TEXT,
    "assessment_settingId" TEXT,
    "applicantTrackingId" TEXT,
    "subscriptionId" TEXT,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicantTracking" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ApplicantTracking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "color" TEXT,
    "country" TEXT,
    "logo" TEXT,
    "employeeRange" TEXT,
    "planToHire" TEXT,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assessment_setting" (
    "id" TEXT NOT NULL,
    "feedback" BOOLEAN DEFAULT true,
    "redirect_candidate" BOOLEAN DEFAULT true,
    "demographic_details" BOOLEAN DEFAULT false,

    CONSTRAINT "Assessment_setting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "type" "RoleType" NOT NULL,
    "code" INTEGER NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "candidate_count" INTEGER,
    "additional_candidate_price" INTEGER,
    "assessment_count" INTEGER,
    "additional_assessment_price" INTEGER,
    "test_count_per_assessment" INTEGER,
    "custom_question_count_per_assessment" INTEGER,
    "user_count" INTEGER,
    "price" DOUBLE PRECISION,
    "duration" INTEGER,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "startingDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "planId" TEXT NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CountryCode" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "CountryCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assessment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "extraTime" INTEGER,
    "isArchived" BOOLEAN DEFAULT false,
    "isAccomodationForNonFluent" BOOLEAN,
    "isAccomodationForAbnormal" BOOLEAN,
    "isAntiCheatingEnabled" BOOLEAN,
    "isEditable" BOOLEAN DEFAULT false,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "languageId" TEXT NOT NULL,
    "jobRoleId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,

    CONSTRAINT "Assessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Language" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobRole" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hasTemplate" BOOLEAN NOT NULL,
    "assessmentTemplateId" TEXT,

    CONSTRAINT "JobRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssessmentTemplate" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "AssessmentTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Test" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "shortDescription" TEXT,
    "longDescription" TEXT,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "audience" TEXT,
    "relevance" TEXT,
    "testTypeId" TEXT NOT NULL,
    "testOwnerId" TEXT NOT NULL,
    "testLevelId" TEXT NOT NULL,
    "languageId" TEXT,
    "jobRoleId" TEXT,
    "coveredSkills" TEXT[],

    CONSTRAINT "Test_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestOwner" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bio" TEXT,
    "profile" TEXT,

    CONSTRAINT "TestOwner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestQuestions" (
    "testId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,

    CONSTRAINT "TestQuestions_pkey" PRIMARY KEY ("testId","questionId")
);

-- CreateTable
CREATE TABLE "TestType" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "TestType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssessmentTest" (
    "assessmentId" TEXT NOT NULL,
    "testId" TEXT NOT NULL,

    CONSTRAINT "AssessmentTest_pkey" PRIMARY KEY ("testId","assessmentId")
);

-- CreateTable
CREATE TABLE "AssessmentQuestion" (
    "assessmentId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,

    CONSTRAINT "AssessmentQuestion_pkey" PRIMARY KEY ("questionId","assessmentId")
);

-- CreateTable
CREATE TABLE "TestLevel" (
    "id" TEXT NOT NULL,
    "level" TEXT NOT NULL,

    CONSTRAINT "TestLevel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "CategoryType" NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionCategories" (
    "questionId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "QuestionCategories_pkey" PRIMARY KEY ("categoryId","questionId")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "title" TEXT,
    "heading" TEXT,
    "description" TEXT,
    "source" "QuestionSource",
    "isPremium" BOOLEAN DEFAULT false,
    "isSample" BOOLEAN DEFAULT false,
    "lookingForAsnwer" TEXT,
    "questionRelevant" TEXT,
    "questionTypeId" TEXT NOT NULL,
    "mCQId" TEXT,
    "codingId" TEXT,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionType" (
    "id" TEXT NOT NULL,
    "title" "Type" NOT NULL,

    CONSTRAINT "QuestionType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MCQ" (
    "id" TEXT NOT NULL,
    "isShuffle" BOOLEAN NOT NULL DEFAULT false,
    "options" TEXT[],
    "answer" TEXT NOT NULL,

    CONSTRAINT "MCQ_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Coding" (
    "id" TEXT NOT NULL,
    "note" TEXT,

    CONSTRAINT "Coding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestCases" (
    "id" TEXT NOT NULL,
    "input" TEXT NOT NULL,
    "output" TEXT NOT NULL,
    "codingId" TEXT NOT NULL,

    CONSTRAINT "TestCases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Candidate" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "gender" TEXT,
    "ageGroup" TEXT,
    "keepPosted" BOOLEAN DEFAULT false,
    "updatedAt" TIMESTAMP(3),
    "teamId" TEXT NOT NULL,

    CONSTRAINT "Candidate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CandidateDetails" (
    "isFluentInEnglish" BOOLEAN,
    "isAbnormal" BOOLEAN,
    "highestEducation" TEXT,
    "study" TEXT,
    "relevant_experience" TEXT,
    "yearOfExperience" INTEGER,
    "country" TEXT,
    "languageProficiency" TEXT,
    "Ethinicity" TEXT,
    "candidateId" TEXT NOT NULL,

    CONSTRAINT "CandidateDetails_pkey" PRIMARY KEY ("candidateId")
);

-- CreateTable
CREATE TABLE "CandidateAssessment" (
    "candidateId" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "candidateSessionId" TEXT,
    "antiCheatingId" TEXT,
    "hiringStageId" TEXT,
    "invitedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "invitationToken" TEXT,
    "status" "CandidateStatus" NOT NULL DEFAULT 'INVITED',
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "marks" TEXT NOT NULL,

    CONSTRAINT "CandidateAssessment_pkey" PRIMARY KEY ("candidateId","assessmentId")
);

-- CreateTable
CREATE TABLE "AntiCheating" (
    "id" TEXT NOT NULL,
    "deviceUsed" TEXT,
    "location" TEXT,
    "isOnlyOneIP" BOOLEAN,
    "isWebcamEnabled" BOOLEAN,
    "isAlwaysFullScreen" BOOLEAN,
    "isMouseUser" BOOLEAN,

    CONSTRAINT "AntiCheating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Snap" (
    "id" TEXT NOT NULL,
    "src" TEXT NOT NULL,
    "antiCheatingId" TEXT NOT NULL,

    CONSTRAINT "Snap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CandidateSession" (
    "id" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),

    CONSTRAINT "CandidateSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CandidateAnswer" (
    "answer" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,

    CONSTRAINT "CandidateAnswer_pkey" PRIMARY KEY ("sessionId","questionId")
);

-- CreateTable
CREATE TABLE "HiringStage" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "HiringStage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecruiterFeedback" (
    "id" TEXT NOT NULL,
    "details" TEXT,
    "rating" INTEGER NOT NULL,
    "type" "FeedbackType" NOT NULL,

    CONSTRAINT "RecruiterFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "User_notificationId_key" ON "User"("notificationId");

-- CreateIndex
CREATE INDEX "User_email_id_idx" ON "User"("email", "id");

-- CreateIndex
CREATE UNIQUE INDEX "Team_companyId_key" ON "Team"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "Team_assessment_settingId_key" ON "Team"("assessment_settingId");

-- CreateIndex
CREATE UNIQUE INDEX "Team_subscriptionId_key" ON "Team"("subscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "ApplicantTracking_name_key" ON "ApplicantTracking"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Role_type_key" ON "Role"("type");

-- CreateIndex
CREATE UNIQUE INDEX "JobRole_assessmentTemplateId_key" ON "JobRole"("assessmentTemplateId");

-- CreateIndex
CREATE UNIQUE INDEX "Question_mCQId_key" ON "Question"("mCQId");

-- CreateIndex
CREATE UNIQUE INDEX "Question_codingId_key" ON "Question"("codingId");

-- CreateIndex
CREATE UNIQUE INDEX "QuestionType_title_key" ON "QuestionType"("title");

-- CreateIndex
CREATE UNIQUE INDEX "CandidateDetails_candidateId_key" ON "CandidateDetails"("candidateId");

-- CreateIndex
CREATE UNIQUE INDEX "CandidateAssessment_candidateSessionId_key" ON "CandidateAssessment"("candidateSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "CandidateAssessment_antiCheatingId_key" ON "CandidateAssessment"("antiCheatingId");

-- CreateIndex
CREATE UNIQUE INDEX "CandidateAssessment_hiringStageId_key" ON "CandidateAssessment"("hiringStageId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "Notification"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_assessment_settingId_fkey" FOREIGN KEY ("assessment_settingId") REFERENCES "Assessment_setting"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_applicantTrackingId_fkey" FOREIGN KEY ("applicantTrackingId") REFERENCES "ApplicantTracking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_jobRoleId_fkey" FOREIGN KEY ("jobRoleId") REFERENCES "JobRole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobRole" ADD CONSTRAINT "JobRole_assessmentTemplateId_fkey" FOREIGN KEY ("assessmentTemplateId") REFERENCES "AssessmentTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Test" ADD CONSTRAINT "Test_testTypeId_fkey" FOREIGN KEY ("testTypeId") REFERENCES "TestType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Test" ADD CONSTRAINT "Test_testOwnerId_fkey" FOREIGN KEY ("testOwnerId") REFERENCES "TestOwner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Test" ADD CONSTRAINT "Test_testLevelId_fkey" FOREIGN KEY ("testLevelId") REFERENCES "TestLevel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Test" ADD CONSTRAINT "Test_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Test" ADD CONSTRAINT "Test_jobRoleId_fkey" FOREIGN KEY ("jobRoleId") REFERENCES "JobRole"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestQuestions" ADD CONSTRAINT "TestQuestions_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestQuestions" ADD CONSTRAINT "TestQuestions_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentTest" ADD CONSTRAINT "AssessmentTest_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentTest" ADD CONSTRAINT "AssessmentTest_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentQuestion" ADD CONSTRAINT "AssessmentQuestion_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentQuestion" ADD CONSTRAINT "AssessmentQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionCategories" ADD CONSTRAINT "QuestionCategories_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionCategories" ADD CONSTRAINT "QuestionCategories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_questionTypeId_fkey" FOREIGN KEY ("questionTypeId") REFERENCES "QuestionType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_mCQId_fkey" FOREIGN KEY ("mCQId") REFERENCES "MCQ"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_codingId_fkey" FOREIGN KEY ("codingId") REFERENCES "Coding"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestCases" ADD CONSTRAINT "TestCases_codingId_fkey" FOREIGN KEY ("codingId") REFERENCES "Coding"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidate" ADD CONSTRAINT "Candidate_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidateDetails" ADD CONSTRAINT "CandidateDetails_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidateAssessment" ADD CONSTRAINT "CandidateAssessment_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidateAssessment" ADD CONSTRAINT "CandidateAssessment_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidateAssessment" ADD CONSTRAINT "CandidateAssessment_candidateSessionId_fkey" FOREIGN KEY ("candidateSessionId") REFERENCES "CandidateSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidateAssessment" ADD CONSTRAINT "CandidateAssessment_antiCheatingId_fkey" FOREIGN KEY ("antiCheatingId") REFERENCES "AntiCheating"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidateAssessment" ADD CONSTRAINT "CandidateAssessment_hiringStageId_fkey" FOREIGN KEY ("hiringStageId") REFERENCES "HiringStage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Snap" ADD CONSTRAINT "Snap_antiCheatingId_fkey" FOREIGN KEY ("antiCheatingId") REFERENCES "AntiCheating"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidateAnswer" ADD CONSTRAINT "CandidateAnswer_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "CandidateSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidateAnswer" ADD CONSTRAINT "CandidateAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
