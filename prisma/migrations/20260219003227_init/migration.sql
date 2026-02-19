-- CreateTable
CREATE TABLE "students" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fullName" TEXT NOT NULL,
    "preferredName" TEXT NOT NULL,
    "dateOfBirth" DATETIME NOT NULL,
    "enrollmentYear" INTEGER NOT NULL,
    "enrollmentGrade" INTEGER NOT NULL,
    "homeCommunity" TEXT NOT NULL,
    "profilePhotoUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "graduationYear" INTEGER,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "annual_snapshots" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "annual_snapshots_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "media_gallery" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "photoUrl" TEXT NOT NULL,
    "caption" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "media_gallery_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "admin_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "annual_snapshots_studentId_year_key" ON "annual_snapshots"("studentId", "year");

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_username_key" ON "admin_users"("username");
