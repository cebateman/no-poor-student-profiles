-- CreateTable
CREATE TABLE "students" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "preferredName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "enrollmentYear" INTEGER NOT NULL,
    "enrollmentGrade" INTEGER NOT NULL,
    "homeCommunity" TEXT NOT NULL,
    "profilePhotoUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "graduationYear" INTEGER,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "annual_snapshots" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "gradeAtTime" INTEGER NOT NULL,
    "photoUrl" TEXT,
    "storyText" TEXT,
    "storyLanguage" TEXT NOT NULL DEFAULT 'Portuguese',
    "storyTranslation" TEXT,
    "dreamCareer" TEXT,
    "favoriteSubject" TEXT,
    "academicNotes" TEXT,
    "extraData" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "annual_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_gallery" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "photoUrl" TEXT NOT NULL,
    "caption" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "media_gallery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "annual_snapshots_studentId_year_key" ON "annual_snapshots"("studentId", "year");

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_username_key" ON "admin_users"("username");

-- AddForeignKey
ALTER TABLE "annual_snapshots" ADD CONSTRAINT "annual_snapshots_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_gallery" ADD CONSTRAINT "media_gallery_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;
