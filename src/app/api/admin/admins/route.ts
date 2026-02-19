import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, hashPassword } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    requireAuth(request);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admins = await prisma.adminUser.findMany({
    select: { id: true, username: true, name: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(admins);
}

export async function POST(request: NextRequest) {
  let currentUser;
  try {
    currentUser = requireAuth(request);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { username, password, name } = body;

  if (!username || !password || !name) {
    return NextResponse.json(
      { error: "Username, password, and name are required" },
      { status: 400 }
    );
  }

  if (password.length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters" },
      { status: 400 }
    );
  }

  const existing = await prisma.adminUser.findUnique({
    where: { username },
  });

  if (existing) {
    return NextResponse.json(
      { error: "Username already exists" },
      { status: 409 }
    );
  }

  const hashedPassword = await hashPassword(password);

  const admin = await prisma.adminUser.create({
    data: { username, password: hashedPassword, name },
    select: { id: true, username: true, name: true, createdAt: true },
  });

  // Suppress unused variable warning - currentUser validates auth
  void currentUser;

  return NextResponse.json(admin, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  let currentUser;
  try {
    currentUser = requireAuth(request);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Admin ID is required" }, { status: 400 });
  }

  // Prevent self-deletion
  if (currentUser.userId === id) {
    return NextResponse.json(
      { error: "Cannot delete your own account" },
      { status: 400 }
    );
  }

  const admin = await prisma.adminUser.findUnique({ where: { id } });
  if (!admin) {
    return NextResponse.json({ error: "Admin not found" }, { status: 404 });
  }

  await prisma.adminUser.delete({ where: { id } });

  return NextResponse.json({ message: "Admin deleted" });
}
