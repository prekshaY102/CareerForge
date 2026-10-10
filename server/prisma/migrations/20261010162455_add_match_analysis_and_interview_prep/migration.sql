-- CreateTable
CREATE TABLE "JobMatchAnalysis" (
    "id" TEXT NOT NULL,
    "overallMatch" INTEGER NOT NULL,
    "matchingSkills" TEXT[],
    "missingSkills" TEXT[],
    "relevantExperience" TEXT[],
    "missingKeywords" TEXT[],
    "recommendedImprovements" TEXT[],
    "jobDescriptionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobMatchAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterviewQuestion" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "userAnswer" TEXT,
    "aiFeedback" TEXT,
    "jobDescriptionId" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InterviewQuestion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "JobMatchAnalysis" ADD CONSTRAINT "JobMatchAnalysis_jobDescriptionId_fkey" FOREIGN KEY ("jobDescriptionId") REFERENCES "JobDescription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobMatchAnalysis" ADD CONSTRAINT "JobMatchAnalysis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewQuestion" ADD CONSTRAINT "InterviewQuestion_jobDescriptionId_fkey" FOREIGN KEY ("jobDescriptionId") REFERENCES "JobDescription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewQuestion" ADD CONSTRAINT "InterviewQuestion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
