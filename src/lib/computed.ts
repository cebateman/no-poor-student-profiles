export function computeAge(dateOfBirth: Date): number {
  const today = new Date();
  const birth = new Date(dateOfBirth);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

export function computeCurrentGrade(enrollmentYear: number, enrollmentGrade: number): number {
  const currentYear = new Date().getFullYear();
  const yearsElapsed = currentYear - enrollmentYear;
  const currentGrade = enrollmentGrade + yearsElapsed;
  // Mozambique school system: cap at grade 12
  return Math.min(currentGrade, 12);
}

export function computeYearsInProgram(enrollmentYear: number): number {
  return new Date().getFullYear() - enrollmentYear;
}

export interface StudentWithComputed {
  id: string;
  fullName: string;
  preferredName: string;
  dateOfBirth: string;
  enrollmentYear: number;
  enrollmentGrade: number;
  homeCommunity: string;
  profilePhotoUrl: string | null;
  status: string;
  graduationYear: number | null;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  age: number;
  currentGrade: number;
  yearsInProgram: number;
  snapshots?: SnapshotData[];
  gallery?: GalleryData[];
}

export interface SnapshotData {
  id: string;
  studentId: string;
  year: number;
  gradeAtTime: number;
  photoUrl: string | null;
  storyText: string | null;
  storyLanguage: string;
  storyTranslation: string | null;
  dreamCareer: string | null;
  favoriteSubject: string | null;
  academicNotes: string | null;
  extraData: Record<string, unknown> | null;
  createdAt: string;
}

export interface GalleryData {
  id: string;
  studentId: string;
  year: number;
  photoUrl: string;
  caption: string | null;
  isFeatured: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function enrichStudent(student: any): StudentWithComputed {
  const dob = new Date(student.dateOfBirth);
  return {
    ...student,
    dateOfBirth: dob.toISOString().split("T")[0],
    createdAt: new Date(student.createdAt).toISOString(),
    updatedAt: new Date(student.updatedAt).toISOString(),
    age: computeAge(dob),
    currentGrade: computeCurrentGrade(student.enrollmentYear, student.enrollmentGrade),
    yearsInProgram: computeYearsInProgram(student.enrollmentYear),
    snapshots: student.snapshots?.map((s: Record<string, unknown>) => ({
      ...s,
      extraData: s.extraData ? JSON.parse(s.extraData as string) : null,
      createdAt: new Date(s.createdAt as string).toISOString(),
    })),
    gallery: student.gallery,
  };
}
