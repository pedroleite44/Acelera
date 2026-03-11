import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    const studentsResult = await sql`
      SELECT COUNT(*) FROM "Student"
    `;

    const classroomsResult = await sql`
      SELECT COUNT(*) FROM "Classroom"
    `;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const presenceResult = await sql`
      SELECT COUNT(DISTINCT "studentId")
      FROM "DailyLog"
      WHERE "createdAt" >= ${today.toISOString()}
        AND "createdAt" < ${tomorrow.toISOString()}
    `;

    const newEnrollmentsResult = await sql`
      SELECT COUNT(*)
      FROM "Student"
      WHERE "createdAt" >= ${today.toISOString()}
        AND "createdAt" < ${tomorrow.toISOString()}
    `;

    return NextResponse.json({
      totalStudents: parseInt(studentsResult[0].count, 10),
      activeClassrooms: parseInt(classroomsResult[0].count, 10),
      dailyPresence: parseInt(presenceResult[0].count, 10),
      newEnrollments: parseInt(newEnrollmentsResult[0].count, 10),
    });

  } catch (error: any) {
    console.error("ERRO AO BUSCAR STATS:", error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}