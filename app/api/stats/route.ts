import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const stats = await prisma.stat.findMany({ orderBy: { sortOrder: "asc" } });
    return NextResponse.json(stats);
  } catch {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { stats } = await request.json();
    // Delete all and re-create (simplest for reordering)
    await prisma.stat.deleteMany();
    for (const stat of stats) {
      const { id: _id, ...data } = stat;
      await prisma.stat.create({ data });
    }
    const updated = await prisma.stat.findMany({ orderBy: { sortOrder: "asc" } });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed to update stats" }, { status: 500 });
  }
}
