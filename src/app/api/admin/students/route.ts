import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { enrichStudent } from "@/lib/computed";

export async function GET(request: NextRequest) {
  try {
    requireAuth(request);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const search = searchParams.get("search");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};

  if (status && status !== "all") {
    where.status = status;
  }

  if (search) {
    where.OR = [
      { fullName: { contains: search } },
      { preferredName: { contains: search } },
      { homeCommunity: { contains: search } },
    ];
  }

  const students = await prisma.student.findMany({
    where,
    include: {
      snapshots: {
        orderBy: { year: "desc" },
        take: 1,
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(students.map(enrichStudent));
}

export async function POST(request: NextRequest) {
  try {
    requireAuth(request);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const {
    fullName,
    preferredName,
    dateOfBirth,
    enrollmentYear,
    enrollmentGrade,
    homeCommunity,
    status = "active",
    isPublic = true,
    graduationYear,
  } = body;

  if (!fullName || !preferredName || !dateOfBirth || !enrollmentYear || !enrollmentGrade || !homeCommunity) {
    return NextResponse.json(
      { error: "Missing required fields: fullName, preferredName, dateOfBirth, enrollmentYear, enrollmentGrade, homeCommunity" },
      { status: 400 }
    );
  }

  const student = await prisma.student.create({
    data: {
      fullName,
      preferredName,
      dateOfBirth: new Date(dateOfBirth),
      enrollmentYear: parseInt(enrollmentYear),
      enrollmentGrade: parseInt(enrollmentGrade),
      homeCommunity,
      status,
      isPublic,
      graduationYear: graduationYear ? parseInt(graduationYear) : null,
    },
  });

  return NextResponse.json(enrichStudent(student), { status: 201 });
}
