import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create admin user
  const hashedPassword = await bcrypt.hash(
    process.env.ADMIN_SEED_PASSWORD || "nopoorafrica2025",
    12
  );

  await prisma.adminUser.upsert({
    where: { username: process.env.ADMIN_SEED_USERNAME || "admin" },
    update: {},
    create: {
      username: process.env.ADMIN_SEED_USERNAME || "admin",
      password: hashedPassword,
      name: "NPA Administrator",
    },
  });

  console.log("Admin user created (username: admin)");

  // Create sample students
  const students = [
    {
      fullName: "Ana Maria Chissano",
      preferredName: "Ana",
      dateOfBirth: new Date("2009-03-15"),
      enrollmentYear: 2022,
      enrollmentGrade: 8,
      homeCommunity: "Xai-Xai",
      status: "active",
      isPublic: true,
    },
    {
      fullName: "Beatriz Josefa Mondlane",
      preferredName: "Bia",
      dateOfBirth: new Date("2008-07-22"),
      enrollmentYear: 2021,
      enrollmentGrade: 8,
      homeCommunity: "Chokwe",
      status: "active",
      isPublic: true,
    },
    {
      fullName: "Celina Augusto Nguenha",
      preferredName: "Celina",
      dateOfBirth: new Date("2007-11-05"),
      enrollmentYear: 2020,
      enrollmentGrade: 8,
      homeCommunity: "Maxixe",
      status: "active",
      isPublic: true,
    },
    {
      fullName: "Diana Rosa Tembe",
      preferredName: "Diana",
      dateOfBirth: new Date("2006-01-30"),
      enrollmentYear: 2019,
      enrollmentGrade: 8,
      homeCommunity: "Xai-Xai",
      status: "graduated",
      isPublic: true,
      graduationYear: 2024,
    },
    {
      fullName: "Esperanca Felicidade Macamo",
      preferredName: "Esperanca",
      dateOfBirth: new Date("2010-09-12"),
      enrollmentYear: 2023,
      enrollmentGrade: 8,
      homeCommunity: "Bilene",
      status: "active",
      isPublic: true,
    },
    {
      fullName: "Fatima Isabel Cossa",
      preferredName: "Fatima",
      dateOfBirth: new Date("2008-05-18"),
      enrollmentYear: 2021,
      enrollmentGrade: 9,
      homeCommunity: "Chokwe",
      status: "active",
      isPublic: true,
    },
  ];

  for (const studentData of students) {
    const student = await prisma.student.create({ data: studentData });
    console.log(`Created student: ${student.preferredName}`);

    // Create annual snapshots for each student
    const currentYear = new Date().getFullYear();
    const yearsInProgram = currentYear - studentData.enrollmentYear;

    for (let i = 0; i <= Math.min(yearsInProgram, 3); i++) {
      const snapshotYear = studentData.enrollmentYear + i;
      const gradeAtTime = studentData.enrollmentGrade + i;

      if (gradeAtTime > 12) break;

      const stories: Record<string, { story: string; translation: string; dream: string; subject: string }> = {
        Ana: {
          story: "Eu quero estudar muito para ser enfermeira e ajudar a minha comunidade.",
          translation: "I want to study hard to become a nurse and help my community.",
          dream: "Nurse",
          subject: "Biology",
        },
        Bia: {
          story: "A educacao e a chave para mudar a minha vida e a vida da minha familia.",
          translation: "Education is the key to changing my life and my family's life.",
          dream: "Teacher",
          subject: "Mathematics",
        },
        Celina: {
          story: "Sonho em ser advogada para defender os direitos das mulheres.",
          translation: "I dream of being a lawyer to defend women's rights.",
          dream: "Lawyer",
          subject: "History",
        },
        Diana: {
          story: "A agricultura e o futuro de Mocambique. Quero ser agronoma.",
          translation: "Agriculture is the future of Mozambique. I want to be an agronomist.",
          dream: "Agronomist",
          subject: "Science",
        },
        Esperanca: {
          story: "Quero ser medica para que ninguem na minha aldeia sofra sem tratamento.",
          translation: "I want to be a doctor so no one in my village suffers without treatment.",
          dream: "Doctor",
          subject: "Chemistry",
        },
        Fatima: {
          story: "Os computadores podem mudar Africa. Quero aprender programacao.",
          translation: "Computers can change Africa. I want to learn programming.",
          dream: "Software Engineer",
          subject: "Computer Science",
        },
      };

      const info = stories[studentData.preferredName];

      await prisma.annualSnapshot.create({
        data: {
          studentId: student.id,
          year: snapshotYear,
          gradeAtTime,
          storyText: info?.story || null,
          storyLanguage: "Portuguese",
          storyTranslation: info?.translation || null,
          dreamCareer: info?.dream || null,
          favoriteSubject: info?.subject || null,
          academicNotes: `${studentData.preferredName} showed strong progress in ${snapshotYear}.`,
          extraData: JSON.stringify({
            attendance_rate: `${85 + Math.floor(Math.random() * 15)}%`,
            scholarship_status: "active",
          }),
        },
      });
    }
  }

  console.log("\nSeed completed successfully!");
  console.log("---");
  console.log("Admin login: username=admin, password=nopoorafrica2025");
  console.log(`Created ${students.length} sample students with annual snapshots`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
