import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import Papa from "papaparse";

interface CSVRow {
  fullName?: string;
  preferredName?: string;
  dateOfBirth?: string;
  enrollmentYear?: string;
  enrollmentGrade?: string;
  homeCommunity?: string;
  status?: string;
  isPublic?: string;
  graduationYear?: string;
}

const REQUIRED_FIELDS = [
  "fullName",
  "preferredName",
  "dateOfBirth",
  "enrollmentYear",
  "enrollmentGrade",
  "homeCommunity",
] as const;

export async function POST(request: NextRequest) {
  try {
    requireAuth(request);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const previewOnly = formData.get("preview") === "true";

  if (!file) {
    return NextResponse.json({ error: "No CSV file provided" }, { status: 400 });
  }

  const text = await file.text();
  const parsed = Papa.parse<CSVRow>(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header: string) => header.trim(),
  });

  if (parsed.errors.length > 0) {
    return NextResponse.json(
      {
        error: "CSV parsing errors",
        details: parsed.errors.slice(0, 10).map((e) => ({
          row: e.row,
          message: e.message,
        })),
      },
      { status: 400 }
    );
  }

  const rows = parsed.data;
  if (rows.length === 0) {
    return NextResponse.json({ error: "CSV file is empty" }, { status: 400 });
  }

  // Validate headers
  const headers = Object.keys(rows[0]);
  const missingHeaders = REQUIRED_FIELDS.filter((f) => !headers.includes(f));
  if (missingHeaders.length > 0) {
    return NextResponse.json(
      {
        error: `Missing required columns: ${missingHeaders.join(", ")}`,
        hint: `Required columns: ${REQUIRED_FIELDS.join(", ")}`,
      },
      { status: 400 }
    );
  }

  // Validate each row
  const validRows: Array<{
    fullName: string;
    preferredName: string;
    dateOfBirth: Date;
    enrollmentYear: number;
    enrollmentGrade: number;
    homeCommunity: string;
    status: string;
    isPublic: boolean;
    graduationYear: number | null;
  }> = [];
  const errors: Array<{ row: number; message: string }> = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowNum = i + 2; // +2 for 1-indexed + header row

    // Check required fields
    const missingFields = REQUIRED_FIELDS.filter(
      (f) => !row[f] || !row[f]!.trim()
    );
    if (missingFields.length > 0) {
      errors.push({
        row: rowNum,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
      continue;
    }

    // Validate date
    const dob = new Date(row.dateOfBirth!.trim());
    if (isNaN(dob.getTime())) {
      errors.push({
        row: rowNum,
        message: `Invalid date format for dateOfBirth: "${row.dateOfBirth}"`,
      });
      continue;
    }

    // Validate numbers
    const enrollmentYear = parseInt(row.enrollmentYear!.trim());
    const enrollmentGrade = parseInt(row.enrollmentGrade!.trim());
    if (isNaN(enrollmentYear) || enrollmentYear < 2000 || enrollmentYear > 2099) {
      errors.push({ row: rowNum, message: `Invalid enrollmentYear: "${row.enrollmentYear}"` });
      continue;
    }
    if (isNaN(enrollmentGrade) || enrollmentGrade < 1 || enrollmentGrade > 12) {
      errors.push({ row: rowNum, message: `Invalid enrollmentGrade: "${row.enrollmentGrade}"` });
      continue;
    }

    // Validate status
    const status = row.status?.trim().toLowerCase() || "active";
    if (!["active", "graduated", "withdrawn", "alumni"].includes(status)) {
      errors.push({ row: rowNum, message: `Invalid status: "${row.status}". Must be active, graduated, withdrawn, or alumni.` });
      continue;
    }

    // Parse optional fields
    const isPublic = row.isPublic?.trim().toLowerCase() !== "false";
    const gradYear = row.graduationYear?.trim();
    const graduationYear = gradYear ? parseInt(gradYear) : null;

    validRows.push({
      fullName: row.fullName!.trim(),
      preferredName: row.preferredName!.trim(),
      dateOfBirth: dob,
      enrollmentYear,
      enrollmentGrade,
      homeCommunity: row.homeCommunity!.trim(),
      status,
      isPublic,
      graduationYear,
    });
  }

  // If preview mode, return validation results without creating
  if (previewOnly) {
    return NextResponse.json({
      totalRows: rows.length,
      validRows: validRows.length,
      errors,
      preview: validRows.slice(0, 20).map((r) => ({
        ...r,
        dateOfBirth: r.dateOfBirth.toISOString().split("T")[0],
      })),
    });
  }

  // Create students in bulk
  if (validRows.length === 0) {
    return NextResponse.json(
      { error: "No valid rows to import", errors },
      { status: 400 }
    );
  }

  const created = await prisma.student.createMany({
    data: validRows,
  });

  return NextResponse.json({
    imported: created.count,
    totalRows: rows.length,
    errors,
  }, { status: 201 });
}
