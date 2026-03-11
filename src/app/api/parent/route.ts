import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const parentId = searchParams.get("parentId");

    if (!parentId) {
      return NextResponse.json(
        { error: "parentId é obrigatório" },
        { status: 400 }
      );
    }

    // Buscar filhos
    const children = await sql`
      SELECT 
        s.id,
        s.name,
        s.rg,
        s.cpf,
        s."classId",
        c.name as "className",
        c."teacherId"
      FROM "Student" s
      JOIN "Classroom" c ON s."classId" = c.id
      WHERE s."parentId" = ${parentId}
      ORDER BY s.name ASC
    `;

    const childrenWithAttendance = await Promise.all(
      children.map(async (child: any) => {

        const attendance = await sql`
          SELECT
            d.id,
            d."studentId",
            d.present,
            d.notes,
            d."createdAt"
          FROM "DailyLog" d
          WHERE d."studentId" = ${child.id}
          AND d."createdAt" >= NOW() - INTERVAL '30 days'
          ORDER BY d."createdAt" DESC
          LIMIT 30
        `;

        return {
          ...child,
          attendance: attendance || [],
        };
      })
    );

    return NextResponse.json(childrenWithAttendance);

  } catch (error: any) {
    console.error("ERRO AO BUSCAR FILHOS:", error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}